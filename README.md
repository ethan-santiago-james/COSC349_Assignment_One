# COSC349 Assignment 1 - Local Virtualised Application

## Application Name: Collaborate (Basic Chat Application)

### Purpose: To allow users to request to meet other people, and message them

### Functionality List:

- As a user, I can sign up an account to use the chat service
- As a user, I can log in using that username, and password
- As a user, I can see up to five random users that I can submit meet requests to
- As a user, I can click the notification bell to see who has requested to meet me
- As a user, I can click the "Chats" screen to see all my friends who I can chat with
- As a user, I can send messages to my all my friends in the chat section

### Application Architecture

- Front End User Interface VM (Vue Front End Web Application that can be accessed via web, and interacts with the API server VM by sending requests)
- API Server (Receives HTTP requests from the frontend VM such as a POST to the /chats endpoint which would represent a user aiming to send a message to another. It writes raw 
SQL queries to the DB server VM)
- DB Server (Data storage for the relational PostgreSQL database. For instance, it persistently stores all the "friendships" between users who have accepted each others meet requests. The DB server receives raw SQL queries from the API server VM to request/insert data)

### Purpose of each provisioning, virtualisation, or packaging tool

- VirtualBox (must install to use) (virtualisation tool that lets you run multiple operating systems on the same computer, needed to boot the frontend, API, and database VM)
- Vagrant (must install to use) (tool that allows a developer to set up and configure different VMs that are physically booted up by VirtualBox. In this case, it allowed me to specify what packages, and code folders should be stored within each VM)
- Shell (provisioning tool that allows each VM to install necessary dependencies to run such as the DB VM being able to install PostgreSQL to store necessary data)
- NPM (packaging tool used in provisioning scripts to install dependencies. For instance, it is used by the API VM to install the Express package)

## Supported host environment, and supported tools

- Windows 11
- VirtualBox Version 7.2.14
- Vagrant 2.4.9
- All other appropriate versioned tools are installed with the start.sh script

## Startup Command

- Run chmod +x start.sh in Collaborate directory
- Run bash -x ./start.sh in target directory to see log output as VMs are being booted up

## Deployment Verification

- vagrant status (check if three virtual machines are running)
- Access 192.168.56.11:3000 on a web browser, and see if you see a page saying "Collaborate API is Running"
- Access the web application at 192.168.56.10:5173, and see if you are presented with the Collaborate home page

## Destroy Command

- Run vagrant destroy in terminal

## How to reach application for use

- Access the web application at 192.168.56.10:5173, and verify the user stories that way
