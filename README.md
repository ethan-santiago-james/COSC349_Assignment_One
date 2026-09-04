# COSC349 Assignment 1 — Local Virtualised Application

## Collaborate — Basic Chat Application

Collaborate is a basic chat application that allows users to discover other users, send meet requests, form connections, and communicate through direct messages.

---

## Functionality

The application supports the following user stories:

* As a user, I can create an account to use the chat service.
* As a user, I can log in using my username and password.
* As a user, I can view up to five random users and send meet requests to them.
* As a user, I can click the notification bell to view meet requests that other users have sent me.
* As a user, I can accept meet requests to form connections with other users.
* As a user, I can open the **Chats** screen to view the users I am connected with.
* As a user, I can send messages to my connections through the chat section.
* As a user, I can log out of the application.

---

# Getting Started

## Supported Host Environment

The project is designed to run on host operating systems supported by both VirtualBox and Vagrant, including Windows, macOS, and Linux.

## Required Software

Before running the application, ensure the following software is installed.

### Git — Version 2.55.0.5

Install Git from:

https://git-scm.com/install/windows

After installation, verify it from Git Bash:

```bash
git --version
```

### VirtualBox — Version 7.2.14

Download VirtualBox from:

https://www.virtualbox.org/wiki/Downloads

Under **VirtualBox Platform Packages**, select the version corresponding to your operating system.

### Vagrant — Version 2.4.9

Download Vagrant from:

https://developer.hashicorp.com/vagrant/install

Before downloading, determine whether your computer uses an **AMD64** or **ARM64** processor architecture and install the appropriate version.

After installation, verify Vagrant from Git Bash:

```bash
vagrant --version
```

### Python — Version 3.14.7

Download Python 3.14.7 from:

https://www.python.org/downloads/release/python-3147/

After installation, verify Python from Git Bash:

```bash
python --version
```

A successful installation should output:

```text
Python 3.14.7
```

Other application dependencies are installed automatically by the `start.sh` script.

### Checking Your Processor Architecture on Windows

Press the **Windows key**, type `cmd`, and open Command Prompt.

Run:

```text
echo %PROCESSOR_ARCHITECTURE%
```

The result indicates your processor architecture:

* `AMD64` — use the AMD64/x64 version.
* `ARM64` — use the ARM64 version.

---

# Installing and Starting the Application

## 1. Clone the Repository

Open Git Bash and run:

```bash
git clone https://github.com/ethan-santiago-james/COSC349_Assignment_One.git
```

Move into the project directory:

```bash
cd COSC349_Assignment_One
```

## 2. Start the Application

From the project's root directory, run:

```bash
bash -x ./start.sh
```

The `-x` option displays the commands being executed by the script, making it easier to follow the provisioning and startup process.

> **Note:** Ensure that unnecessary applications are closed before running the startup command. The virtual machines share your host machine's resources, and insufficient available RAM can significantly increase VM startup and SSH configuration times.

> **Also Note:** The initial deployment may take several minutes because the virtual machines must be created and their required software and dependencies installed. 

> **Also Note:** To log into multiple accounts at once, you need to use separate browser. This is because the logged in user variable is cached in browser storage.

The startup script creates and configures all three VMs and launches the required application services.

---

# Deployment Verification

At the end of `start.sh`, two checks are performed to verify that the application has been deployed successfully.

## 1. Verify VM Status

```bash
vagrant status
```

This verifies that the required Vagrant VMs have been created and are running.

## 2. Verify Application Functionality

```bash
python selenium_test.py
```

The Selenium test simulates a user interacting with the application by:

1. Registering a new user.
2. Logging in with that account.
3. Accessing the application's main dashboard.

This provides an end-to-end deployment check because completing these operations requires communication across all three VMs:

**Selenium → Front-End VM → API VM → Database VM**

---

# Accessing the Application

Once deployment has completed successfully, open a web browser and navigate to:

```text
http://192.168.56.10:5173
```

The application can then be manually tested using the user stories listed in the **Functionality** section.

---

# Demonstration Data

The database's `schema.sql` file inserts sample users into the database during setup.

This ensures that after creating an account and logging in, a new user can immediately see other users to whom they can send meet requests.

---

# Redeploying the Application

The same startup command can be used to perform a clean redeployment:

```bash
bash -x ./start.sh
```

The startup script runs `vagrant destroy` before the `vagrant up` commands. Therefore, the existing VMs are destroyed and recreated as part of the deployment process.

This provides a clean environment based on the current `Vagrantfile`, provisioning configuration, database schema, and application source code.

---

# Destroying the Environment

To stop and permanently remove the application's virtual machines, run the following command from the project directory:

```bash
vagrant destroy
```

Vagrant will ask for confirmation before destroying the VMs.

---

# Application Architecture

Collaborate is deployed across three separate Ubuntu virtual machines. Each VM has a distinct responsibility.

## Front-End User Interface VM

The Front-End VM hosts the Vue web application that users access through a web browser.

It provides the application's interactive user interface and communicates with the API VM by sending HTTP requests. It does not communicate directly with the database.

## API Server VM

The API VM hosts the application's Express REST API and handles HTTP requests sent by the Front-End VM.

For example, a `POST` request to a chat endpoint can represent a user sending a message to another user. The API processes these requests and communicates with the Database VM by executing SQL queries to retrieve, insert, update, or delete application data.

## Database Server VM

The Database VM hosts the application's PostgreSQL relational database and provides persistent storage for application data, including:

* User accounts
* Meet requests
* Connections between users
* Chat messages

The Database VM receives SQL queries from the API VM, executes them against the PostgreSQL database, and returns the results to the API VM.

## Request Flow

The overall request flow is:

**User → Front-End VM → API VM → Database VM**

Responses travel back through the same architecture:

**Database VM → API VM → Front-End VM → User**

---

# Tools and Technologies

## VirtualBox — Virtualisation Tool

VirtualBox provides the underlying virtualisation platform used to create and run the three Ubuntu VMs:

* Front-End VM
* API VM
* Database VM

Each VM behaves like a separate computer with its own operating system, network interfaces, installed software, and filesystem.

## Vagrant — VM Configuration and Orchestration

Vagrant automates the creation and configuration of the VirtualBox VMs using the project's `Vagrantfile`.

The `Vagrantfile` specifies properties such as:

* VM names
* Private IP addresses
* Networking configuration
* Synced folders
* VM configuration
* Provisioning behaviour

This allows another developer to recreate the same three-VM environment without manually creating and configuring each VM through VirtualBox.

## Bash — Provisioning and Scripting

Bash is used to execute the commands required to set up and start the application environment.

The project's `start.sh` script performs tasks such as:

* Starting the VMs
* Installing dependencies
* Configuring PostgreSQL
* Installing Node.js packages
* Mounting required directories
* Starting the Vue frontend
* Starting the Express API

## APT (`apt`) — Operating-System Package Manager

APT is used during provisioning to download and install system-level packages inside the Ubuntu VMs.

For example, APT is used to install software such as `curl`, PostgreSQL, and Node.js-related system packages.

APT differs from NPM because **APT installs operating-system-level software**, whereas **NPM installs JavaScript project dependencies**.

## NPM — JavaScript Package Manager

NPM installs the JavaScript dependencies required by the Vue frontend and Express API based on their respective `package.json` files.

For example:

* The API VM uses NPM to install Express and PostgreSQL client libraries.
* The Front-End VM uses NPM to install Vue and its supporting packages.

## Pip — Python Package Manager

Pip is used to install the Python dependencies required for automated testing of the application.

In particular, Pip installs Selenium, which is required to run `selenium_test.py`. This test script uses Selenium to automate interaction with the web application through a browser, allowing the application's functionality and communication between its components to be tested automatically.
