# COSC349 Assignment 1 - Local Virtualised Application

## Application Name: Collaborate (Basic Chat Application)

### Purpose: To allow users to request to meet other people, and message them

### Functionality List:

- As a user, I can sign up an account to use the chat service
- As a user, I can log in using that username, and password
- As a user, I can see up to five random users that I can submit meet requests to when logged in
- As a user, I can click the notification bell to see who has requested to meet me
- As a user, I can click the "Chats" screen to see all my friends who I can chat with
- As a user, I can send messages to my all my friends in the chat section
- Go to the "Functionality to Test" section at the bottom of file to test the application after startup

### Application Architecture

- Front End User Interface VM (Vue Front End Web Application that can be accessed via web, serves dynamic web content to the user, and interacts with the API server VM by sending requests)
- API Server (Receives HTTP requests from the frontend VM such as a POST to the /chats endpoint which would represent a user aiming to send a message to another. It writes raw 
SQL queries to the DB server VM)
- DB Server (Data storage for the relational PostgreSQL database. For instance, it persistently stores all the "friendships" between users who have accepted each others meet requests. The DB server receives raw SQL queries from the API server VM to request/insert data)

### Purpose of each provisioning, virtualisation, or packaging tool

- VirtualBox (must install to use) (virtualisation tool that lets you run multiple operating systems on the same computer, needed to boot the frontend, API, and database VM)
- Vagrant (must install to use) (tool that allows a developer to set up and configure different VMs that are physically booted up by VirtualBox. In this case, it allowed me to specify what packages, and code folders should be stored within each VM as well as the provisioning scripts that would be run by the)
- Bash Shell (provisioning tool used to provision each VM by installing and configuring required dependencies; for example, installing PostgreSQL on the database VM for persistent data storage.)
- NPM (packaging tool used in provisioning scripts to install dependencies. For instance, it is used by the API VM to install the Express package)

## Supported host environment, and supported tools

- All Host Operating Systems (VirtualBox, and Vagrant are available for Windows, macOS, and Linux)
- VirtualBox Version 7.2.14
- Vagrant 2.4.9
- All other appropriate versioned tools are installed with the start.sh script

## Demonstration Data

- The schema.sql inserts some sample data into the database so that new users can see up to five users to request meeting up with

## Startup Command

- Run chmod +x start.sh in Collaborate directory
- Run bash -x ./start.sh in target directory to see log output as VMs are being booted up

## Deployment Verification

- vagrant status (check if three virtual machines are running)
- Access 192.168.56.11:3000 on a web browser, and see if you see a page saying "Collaborate API is Running"
- Access the web application at 192.168.56.10:5173, and see if you are presented with the Collaborate home page
- If you can successfully register an account, and login, it means that the database VM is functional


## Destroy Command

- Run vagrant destroy in Collaborate directory

## How to reach application for use

- Access the web application at 192.168.56.10:5173, and verify the user stories that way

## Functionality to test

- Register two users on separate web browsers (this is important as a logged in user is stored in browser storage)
- Log into both accounts on the separate browsers
- On each account, you should see up to five users that you can request to meet (this is dummy data)
- On one of the accounts, keep refreshing the page until you see the other account that you 
registered with on the other browser
- Click "Request To Meet" once you see that user
- On the page of the other user, you should see a notification bell with one notification, click on it
- Accept the request from the other user
- On both user accounts, click on the Chats page at the bottom of the screen
- Verify that the two users can send messages to one another