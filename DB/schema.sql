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
        FOREIGN KEY (Sender) REFERENCES User(Username),

    CONSTRAINT Receiver_FK
        FOREIGN KEY (Receiver) REFERENCES User(Username)
);

CREATE TABLE User_Connection (
    Username_One VARCHAR(100) NOT NULL,
    Username_Two VARCHAR(100) NOT NULL,

    Time_Of_Last_Call TIMESTAMP NOT NULL,
    Time_Of_Last_Meet TIMESTAMP NOT NULL,

    CONSTRAINT User_Connection_PK
        PRIMARY KEY (Username_One, Username_Two),

    CONSTRAINT Username_One_FK
        FOREIGN KEY (Username_One) REFERENCES User(Username),

    CONSTRAINT Username_Two_FK
        FOREIGN KEY (Username_Two) REFERENCES User(Username)
);

CREATE TABLE Chat (
    From_User VARCHAR(100) NOT NULL,
    To_User VARCHAR(100) NOT NULL,
    Time_Of_Send TIMESTAMP NOT NULL,
    Content TEXT NOT NULL,

    CONSTRAINT From_User_FK
        FOREIGN KEY (From_User) REFERENCES User(Username),

    CONSTRAINT To_User_FK
        FOREIGN KEY (To_User) REFERENCES User(Username)
);