const express = require('express');
const cors = require('cors');
const { signUpUser, authenticateUser, fetchFiveRandomUsers, createMeetRequest, getMeetRequests, 
    hasAcceptedMeetRequest, createUserConnection, getUserConnections, sendChat, getChats } = require('./db');

const app = express();
const port = 3000;

const allowedOrigins = (process.env.FRONTEND_ORIGINS ??
    'http://localhost:8081,http://localhost:5173,http://192.168.56.10:5173')
    .split(',')
    .map((origin) => origin.trim());

app.use(cors({
    origin(origin, callback) {
        // Requests without an Origin header (for example curl) remain available for API checks.
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
}));
app.use(express.json());

app.get('/', (request, response) => {
	response.send('Collaborate API is running');
});

app.post('/signup', async (req, res) => {
    try {
        const user = await signUpUser({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Signup failed', error);
        res.status(500).json({ error: 'Unable to create user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await authenticateUser(req.body.username, req.body.password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Login failed', error);
        res.status(500).json({ error: 'Unable to authenticate user' });
    }
});

app.get('/get_users',async (req,res) => {

    try {

        const users = await fetchFiveRandomUsers();
        
        if (!users) {
            return res.status(401).json({ error: 'Not enough users' });
        }

        res.status(200).json(users)

    } catch(error) {

        console.error('Failed to get users: ', error);
        res.status(500).json({ error: 'Unable to authenticate user' });
    }

})

app.post('/send_meet_request', async (req, res) => {
    try {
        const { sender, receiver, timeOfSend } = req.body;

        const meetRequest = await createMeetRequest({
            sender,
            receiver,
            timeOfSend
        });

        res.status(201).json(meetRequest);

    } catch (error) {
        console.error("Failed to send meet request: ", error);
        res.status(500).json({
            error: 'Unable to send meet request'
        });
    }
});

app.get('/meet_requests', async (req, res) => {
    try {
        const { username } = req.query;

        const meetRequests = await getMeetRequests(username);
        console.log(meetRequests)
        res.status(200).json(meetRequests);

    } catch (error) {
        console.error("Failed to get meet requests: ", error);
        res.status(500).json({
            error: 'Unable to get meet requests'
        });
    }
});

app.get('/has_accepted_meet_request', async (req,res) => {

    try {
        const { sender, receiver } = req.query;

        const accepted = await hasAcceptedMeetRequest(sender, receiver);

        if (accepted) {
            res.status(200).json({ hasAcceptedRequest: true });
        } else {
            res.status(200).json({ hasAcceptedRequest: false });
        }

    } catch (error) {
        console.error("Failed to get meet requests: ", error);
        res.status(500).json({
            error: 'Unable to get meet requests'
        });
    }


}) 

app.post('/user_connection', async (req,res) => {

    try {

        const usernameOne = req.body.usernameOne;
        const usernameTwo = req.body.usernameTwo;

        const userConnection = await createUserConnection(usernameOne,usernameTwo)

        res.status(201).json(userConnection);

    } catch (error) {
        console.error("Failed to initiate user connection: ", error);
        res.status(500).json({
            error: 'Unable to get meet requests'
        });
    }

})

app.get('/user_connections', async (req,res) => {

    try {

        const { username } = req.query;
        console.log(username)
        const userConnections = await getUserConnections(username);
        console.log(userConnections.length)
        res.status(201).json(userConnections)

    } catch (error) {
        console.error("Failed to initiate user connection: ", error);
        res.status(500).json({
            error: 'Unable to get meet requests'
        });
    }

})

app.post('/chat', async (req, res) => {
    try {
        const sender = req.body.sender;
        const recipient = req.body.recipient;
        const timeOfSend = new Date().toISOString();
        const content = req.body.content;

        const postedChat = await sendChat(
            sender,
            recipient,
            timeOfSend,
            content
        );

        res.status(201).json(postedChat);

    } catch (err) {
        console.error("Failed to initiate user chat:", err);

        res.status(500).json({
            error: 'Unable to send chat'
        });
    }
});

app.get('/chats', async (req, res) => {
    try {
        const usernameOne = req.query.usernameOne;
        const usernameTwo = req.query.usernameTwo;

        const chats = await getChats(usernameOne, usernameTwo);
        console.log(chats)
        res.status(200).json(chats);

    } catch (err) {
        console.error("Failed to get chats:", err);

        res.status(500).json({
            error: 'Unable to get chats'
        });
    }
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
