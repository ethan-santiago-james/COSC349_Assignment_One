
DROP TABLE IF EXISTS Chat CASCADE;
DROP TABLE IF EXISTS User_Connection CASCADE;
DROP TABLE IF EXISTS Meet_Request CASCADE;
DROP TABLE IF EXISTS Collaborate_User CASCADE;

CREATE TABLE Collaborate_User (
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Username VARCHAR(100) PRIMARY KEY,
    Password VARCHAR(200) NOT NULL,
    User_Profile_Picture BYTEA,
    Meetup_Points INTEGER DEFAULT 0
);

CREATE TABLE Meet_Request (
    Sender VARCHAR(100) NOT NULL,
    Receiver VARCHAR(100) NOT NULL,
    Time_Of_Send TIMESTAMP NOT NULL,
    Status CHAR(1) DEFAULT 'P',

    CONSTRAINT Sender_FK
        FOREIGN KEY (Sender) REFERENCES Collaborate_User(Username),

    CONSTRAINT Receiver_FK
        FOREIGN KEY (Receiver) REFERENCES Collaborate_User(Username)
);

CREATE TABLE User_Connection (
    Username_One VARCHAR(100) NOT NULL,
    Username_Two VARCHAR(100) NOT NULL,

    Time_Of_Last_Call TIMESTAMP,
    Time_Of_Last_Meet TIMESTAMP,

    CONSTRAINT User_Connection_PK
        PRIMARY KEY (Username_One, Username_Two),

    CONSTRAINT Username_One_FK
        FOREIGN KEY (Username_One) REFERENCES Collaborate_User(Username),

    CONSTRAINT Username_Two_FK
        FOREIGN KEY (Username_Two) REFERENCES Collaborate_User(Username)
);

CREATE TABLE Chat (
    From_User VARCHAR(100) NOT NULL,
    To_User VARCHAR(100) NOT NULL,
    Time_Of_Send TIMESTAMP NOT NULL,
    Content TEXT NOT NULL,

    CONSTRAINT From_User_FK
        FOREIGN KEY (From_User) REFERENCES Collaborate_User(Username),

    CONSTRAINT To_User_FK
        FOREIGN KEY (To_User) REFERENCES Collaborate_User(Username)
);


-- =========================================================
-- TEST USERS
-- =========================================================

-- Passwords below are stored as bcrypt hashes.

INSERT INTO Collaborate_User
    (First_Name, Last_Name, Username, Password, Meetup_Points)
VALUES
    ('Ethan', 'James', 'ethan',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 120),

    ('Alice', 'Smith', 'alice',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 85),

    ('Ben', 'Wilson', 'ben',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 60),

    ('Charlie', 'Brown', 'charlie',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 150),

    ('Daisy', 'Taylor', 'daisy',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 40),

    ('Jack', 'Anderson', 'jack',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 95),

    ('Sophie', 'Martin', 'sophie',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 75),

    ('Oliver', 'Thompson', 'oliver',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 110),

    ('Mia', 'Robinson', 'mia',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 55),

    ('Noah', 'Harris', 'noah',
     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 30);


-- =========================================================
-- TEST MEET REQUESTS
-- P = Pending
-- A = Accepted
-- R = Rejected
-- =========================================================

INSERT INTO Meet_Request
    (Sender, Receiver, Time_Of_Send, Status)
VALUES
    ('alice', 'ethan', '2026-08-20 10:30:00', 'A'),
    ('ethan', 'ben', '2026-08-21 14:15:00', 'A'),
    ('charlie', 'ethan', '2026-08-22 09:45:00', 'P'),
    ('daisy', 'ethan', '2026-08-23 16:20:00', 'P'),
    ('jack', 'alice', '2026-08-21 11:10:00', 'A'),
    ('sophie', 'alice', '2026-08-24 13:30:00', 'P'),
    ('oliver', 'ben', '2026-08-19 15:00:00', 'R'),
    ('mia', 'charlie', '2026-08-25 17:45:00', 'A'),
    ('noah', 'ethan', '2026-08-26 12:00:00', 'P'),
    ('ben', 'daisy', '2026-08-27 09:20:00', 'R');


-- =========================================================
-- TEST USER CONNECTIONS
-- =========================================================

INSERT INTO User_Connection
    (Username_One, Username_Two, Time_Of_Last_Call, Time_Of_Last_Meet)
VALUES
    ('ethan', 'alice', '2026-08-25 18:30:00', '2026-08-24 12:00:00'),
    ('ethan', 'ben', '2026-08-26 19:00:00', '2026-08-25 13:30:00'),
    ('ethan', 'charlie', '2026-08-27 17:15:00', '2026-08-26 11:00:00'),
    ('alice', 'jack', '2026-08-24 20:00:00', '2026-08-23 14:00:00'),
    ('charlie', 'mia', '2026-08-26 16:45:00', '2026-08-25 15:30:00'),
    ('ben', 'daisy', '2026-08-22 18:00:00', '2026-08-21 10:30:00'),
    ('alice', 'sophie', '2026-08-27 19:30:00', '2026-08-26 13:00:00'),
    ('ben', 'oliver', '2026-08-28 12:15:00', '2026-08-27 16:00:00');


-- =========================================================
-- TEST CHAT MESSAGES
-- =========================================================

INSERT INTO Chat
    (From_User, To_User, Time_Of_Send, Content)
VALUES
    ('alice', 'ethan', '2026-08-24 11:30:00',
        'Hey Ethan, are you free to meet up sometime this week?'),

    ('ethan', 'alice', '2026-08-24 11:35:00',
        'Yeah, definitely! How about tomorrow afternoon?'),

    ('alice', 'ethan', '2026-08-24 11:40:00',
        'Sounds good. How about 2pm?'),

    ('ethan', 'alice', '2026-08-24 11:42:00',
        'Perfect, see you then!'),

    ('ethan', 'ben', '2026-08-25 13:00:00',
        'Hey Ben, want to grab a coffee sometime?'),

    ('ben', 'ethan', '2026-08-25 13:05:00',
        'Sure! I am free tomorrow morning.'),

    ('ethan', 'ben', '2026-08-25 13:10:00',
        'Awesome, lets meet at the cafe on campus.'),

    ('charlie', 'ethan', '2026-08-26 09:15:00',
        'Hey, I saw your profile. Would you like to connect?'),

    ('ethan', 'charlie', '2026-08-26 09:20:00',
        'Yeah, sounds good! What are you studying?'),

    ('charlie', 'ethan', '2026-08-26 09:25:00',
        'Computer Science. I am working on a group project at the moment.'),

    ('ethan', 'charlie', '2026-08-26 09:30:00',
        'Nice, I am doing Software Engineering.'),

    ('jack', 'alice', '2026-08-23 14:00:00',
        'Are you still interested in meeting this weekend?'),

    ('alice', 'jack', '2026-08-23 14:05:00',
        'Yep! Saturday works for me.'),

    ('mia', 'charlie', '2026-08-25 15:30:00',
        'Want to catch up after class?'),

    ('charlie', 'mia', '2026-08-25 15:35:00',
        'Absolutely. I will message you when I finish.'),

    ('ben', 'daisy', '2026-08-27 09:20:00',
        'Hey Daisy!'),

    ('daisy', 'ben', '2026-08-27 09:25:00',
        'Hi Ben!');

