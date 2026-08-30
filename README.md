# COSC349 Assignment 1 - Local Virtualised Application

## Application Name: Basic Chat Application

### Purpose: To allow users to request to meet other people, and message them

### Functionality List:

- As a user, I can sign up an account to use the chat service
- As a user, I can log in using that username, and password
- As a user, I can see up to five random users that I can submit meet requests to
- As a user, I can click the notification bell to see who has requested to meet me
- As a user, I can click the "Chats" screen to see all my friends who I can chat with
- As a user, I can send messages to my all my friends in the chat section

### Application Architecture

- Front End User Interface VM (Expo Go/React Native Mobile Application that can be accessed via web, and interacts with the API server VM by sending requests)
- API Server (Receives HTTP requests from the frontend VM such as a POST to the /chats endpoint which would represent a user aiming to send a message to another. It writes raw 
SQL queries to the DB server VM)
- DB Server (Data storage for the relational PostgreSQL database. For instance, it persistently stores all the "friendships" between users who have accepted each others meet requests. The DB server receives raw SQL queries from the API server VM to request/insert data)

### Purpose of each provisioning, virtualisation, or packaging tool

- VirtualBox (must install to use) (virtualisation tool that lets you run multiple operating systems on the same computer, needed to boot the frontend, API, and database VM)
- Shell (provisioning tool that allows each VM to install necessary dependencies to run such as the DB VM being able to install PostgreSQL to store necessary data)
- NPM (packaging tool used in provisioning scripts to install dependencies. For instance, it is used by the API VM to install the Express package)
- NPX (packaging, and runtime tool used for the UI VM to run the Expo application that 
contains the UI that the user interacts with to make requests)

## Startup Command

- Run ./start.sh in target directory

## Deployment Verification

- Check that all virtual machines are running:

- vagrant status

- SSH into an individual VM to verify its services:

- vagrant ssh db
- vagrant ssh api
- vagrant ssh web

## Destroy Command

- Run vagrant destroy in terminal

## Deployment and System Requirements


## Troubleshooting

### Web Key

- Run vagrant ssh-config web
- The keys being used to SSH into the VM are listed under the "IdentityFile" header
- Test that you can SSH into the VM using either key (i.e ssh -i {absolute_path_of_key} -p 2222 vagrant@127.0.0.1)
- If you get WARNING: UNPROTECTED PRIVATE KEY FILE! do the following
- Open Powershell as administrator and run
- icacls "$env:USERPROFILE\.vagrant.d\insecure_private_keys\vagrant.key.rsa" /inheritance:r
- icacls "$env:USERPROFILE\.vagrant.d\insecure_private_keys\vagrant.key.rsa" /remove [recommended user to remove]
- icacls "$env:USERPROFILE\.vagrant.d\insecure_private_keys\vagrant.key.rsa" /grant "${env:USERNAME}:F"

