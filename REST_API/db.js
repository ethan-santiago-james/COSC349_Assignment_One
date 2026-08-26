const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	user: 'postgres',
	password: 'postgres',
	options: '-c search_path=collaborate',
});



pool.on('error', (error) => {
	console.error('Unexpected PostgreSQL pool error', error);
});

async function signUpUser({ firstName, lastName, username, password }) {
	const passwordHash = await bcrypt.hash(password, 12);
	const result = await pool.query(
		`INSERT INTO collaborate_user (first_name, last_name, username, password)
		 VALUES ($1, $2, $3, $4)
		 RETURNING first_name, last_name, username, meetup_points`,
		[firstName, lastName, username, passwordHash],
	);

	return result.rows[0];
}

async function authenticateUser(username, password) {
	const result = await pool.query(
		`SELECT first_name, last_name, username, password, meetup_points
		 FROM collaborate_user
		 WHERE username = $1`,
		[username],
	);

	const user = result.rows[0];
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return null;
	}

	const { password: passwordHash, ...safeUser } = user;
	return safeUser;
}

async function fetchFiveRandomUsers() { 
    const result = await pool.query(`
        SELECT * FROM collaborate_user
        ORDER BY RANDOM()
        LIMIT 5;
    `); 

    const users = result.rows; 

    return users;
}

async function createMeetRequest({ sender, receiver, timeOfSend }) {
    const result = await pool.query(`
        INSERT INTO meet_request (Sender, Receiver, Time_Of_Send)
        VALUES ($1, $2, $3)
        RETURNING *;
    `, [sender, receiver, timeOfSend]);

    return result.rows[0];
}

async function getMeetRequests(username) {
    const result = await pool.query(`
        SELECT
            Sender,
            Receiver,
            Time_Of_Send::text AS "Time_Of_Send",
            Status
        FROM Meet_Request
        WHERE Receiver = $1
        ORDER BY Time_Of_Send DESC;
    `, [username]);

    return result.rows;
}

async function hasAcceptedMeetRequest(sender, receiver) {
    const result = await pool.query(`
        SELECT 1
        FROM Meet_Request
        WHERE Status = 'P'
          AND (
              (Sender = $1 AND Receiver = $2)
              OR
              (Sender = $2 AND Receiver = $1)
          )
        LIMIT 1;
    `, [sender, receiver]);

    return result.rowCount > 0;
}

async function createUserConnection(usernameOne, usernameTwo) {
    const result = await pool.query(`
        INSERT INTO User_Connection (
            Username_One,
            Username_Two
        )
        VALUES ($1, $2)
        RETURNING *;
    `, [usernameOne, usernameTwo]);

    await pool.query(`
        DELETE FROM Meet_Request
        WHERE
            (Sender = $1 AND Receiver = $2)
            OR
            (Sender = $2 AND Receiver = $1);
    `, [usernameOne, usernameTwo]);

    return result.rows[0];
}

async function getUserConnections(username) {
    const result = await pool.query(`
        SELECT
            CASE
                WHEN Username_One = $1 THEN Username_Two
                ELSE Username_One
            END AS username
        FROM User_Connection
        WHERE Username_One = $1
           OR Username_Two = $1;
    `, [username]);

    return result.rows;
}

async function sendChat(sender, recipient, timeOfSend, content) {

    const result = await pool.query(
        `
        INSERT INTO Chat (
            From_User,
            To_User,
            Time_Of_Send,
            Content
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            From_User,
            To_User,
            Time_Of_Send,
            Content
        `,
        [sender, recipient, timeOfSend, content]
    );

    return result.rows[0];
}

async function getChats(usernameOne, usernameTwo) {
    const result = await pool.query(`
        SELECT
            From_User,
            To_User,
            Time_Of_Send,
            Content
        FROM Chat
        WHERE
            (From_User = $1 AND To_User = $2)
            OR
            (From_User = $2 AND To_User = $1)
        ORDER BY Time_Of_Send ASC
    `, [usernameOne, usernameTwo]);

    return result.rows;
}

module.exports = { pool, signUpUser, authenticateUser, fetchFiveRandomUsers, createMeetRequest, getMeetRequests, hasAcceptedMeetRequest, 
	createUserConnection, getUserConnections, sendChat, getChats };
