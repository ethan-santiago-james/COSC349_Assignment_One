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
- As a user, I can log out of the application

### Application Architecture

Front-End User Interface VM
    Hosts the Vue web application that users access through a web browser. It serves the application's interactive user interface and communicates with the API VM by sending HTTP requests.
API Server VM
    Hosts the application's REST API and handles HTTP requests from the Front-End VM. For example, a POST request to the /chats endpoint represents a user sending a message to another user. The API processes these requests and communicates with the DB VM by executing SQL queries to retrieve, insert, update, or delete application data.
Database Server VM
    Hosts the application's PostgreSQL relational database and provides persistent storage for application data. For example, it stores the connections between users who have accepted each other's meet requests. The DB VM receives SQL queries from the API VM, executes them against the database, and returns the resulting data to the API VM.

### Purpose of each provisioning, virtualisation, or packaging tool

VirtualBox — Virtualisation tool
    Provides the underlying virtualisation platform used to create and run the three Ubuntu VMs: the Front-End VM, API VM, and Database VM. Each VM behaves like a separate computer with its own operating system, network interface, installed software, and filesystem.
Vagrant — VM configuration and orchestration tool
    Automates the creation and configuration of the VirtualBox VMs using the Vagrantfile. It specifies properties which are VM names, private IP addresses, synced folders, networking, and provisioning commands. This allows another developer to recreate the same three-VM environment consistently without manually configuring each VM.
Bash — Scripting/shell tool used for provisioning
    Executes the provisioning commands used to configure the VMs. For example, Bash scripts install dependencies, configure PostgreSQL, install Node.js packages, mount directories, and start the Vue and Express applications. 
APT (apt) — Operating-system package manager
    Used during provisioning to download and install system-level packages inside the Ubuntu VMs. For example, apt can install curl, PostgreSQL, and Node.js-related system packages. This is worth mentioning because it is different to NPM: APT installs OS-level software, whereas NPM installs JavaScript packages.
NPM — JavaScript package manager
    Installs the JavaScript dependencies required by the Vue frontend and Express API from their respective package.json files. For example, the API VM uses NPM to install Express and PostgreSQL client libraries, while the Front-End VM uses it to install Vue and its supporting packages.

## Supported host environment, and supported tools

- All Host Operating Systems (VirtualBox, and Vagrant are available for Windows, macOS, and Linux)
- VirtualBox Version 7.2.14
- Vagrant 2.4.9
- Python 3.14.3 (needed for test file)
- All other appropriate versioned tools are installed with the start.sh script

## Demonstration Data

- The schema.sql inserts some sample data into the database so that new users can see up to five users to request meeting up with

## Startup Command

- Run bash -x ./start.sh in project directory to see log output as VMs are being booted up (this takes a while to boot up)
- Redeployment can be run with same script as vagrant destroy is run before all vagrant up commands

## Deployment Verification

- vagrant status (runs at the end of start.sh script to verify VMs are running)
- python -m pip install pip==26.1.1
- pip install selenium
- python selenium_test.py (verifies that a mock user can login, and access the main dashboard as this involves all VMs)

## Destroy Command

- Run vagrant destroy in project directory

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