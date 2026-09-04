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

# Application Architecture

Collaborate is deployed across three separate Ubuntu virtual machines. Each VM has a distinct responsibility.

### Front-End User Interface VM

Hosts the Vue web application that users access through a web browser.

The Front-End VM provides the application's interactive user interface and communicates with the API VM by sending HTTP requests. It does not communicate directly with the database.

### API Server VM

Hosts the application's Express REST API and handles HTTP requests sent by the Front-End VM.

For example, a `POST` request to a chat endpoint can represent a user sending a message to another user. The API processes these requests and communicates with the Database VM by executing SQL queries to retrieve, insert, update, or delete application data.

### Database Server VM

Hosts the application's PostgreSQL relational database and provides persistent storage for application data.

This includes information such as:

* User accounts
* Meet requests
* Connections between users
* Chat messages

The Database VM receives SQL queries from the API VM, executes them against the PostgreSQL database, and returns the results to the API VM.

The overall request flow is therefore:

**User → Front-End VM → API VM → Database VM**

Responses travel back through the same architecture:

**Database VM → API VM → Front-End VM → User**

---

# Tools Used

## VirtualBox — Virtualisation Tool

VirtualBox provides the underlying virtualisation platform used to create and run the three Ubuntu VMs:

* Front-End VM
* API VM
* Database VM

Each VM behaves like a separate computer with its own operating system, network interfaces, installed software, and filesystem.

## Vagrant — VM Configuration and Orchestration Tool

Vagrant automates the creation and configuration of the VirtualBox VMs using the project's `Vagrantfile`.

The `Vagrantfile` specifies properties such as:

* VM names
* Private IP addresses
* Networking configuration
* Synced folders
* VM configuration
* Provisioning behaviour

This allows another developer to recreate the same three-VM environment without having to manually create and configure each VM through VirtualBox.

## Bash — Provisioning and Scripting Tool

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

APT is different from NPM because **APT installs operating-system-level software**, whereas **NPM installs JavaScript project dependencies**.

## NPM — JavaScript Package Manager

NPM installs the JavaScript dependencies required by the Vue frontend and Express API based on their respective `package.json` files.

For example:

* The API VM uses NPM to install Express and PostgreSQL client libraries.
* The Front-End VM uses NPM to install Vue and its supporting packages.

---

# Supported Host Environment

The project is designed to run on host operating systems supported by both VirtualBox and Vagrant, including Windows, macOS, and Linux.

The environment used to develop and test the project uses:

* **Git** 2.55.0.5
* **VirtualBox:** 7.2.14
* **Vagrant:** 2.4.9
* **Python:** 3.14.6 — required to run the Selenium verification test

Other application dependencies are installed automatically by the `start.sh` script.

---

# Demonstration Data

The database's `schema.sql` file inserts sample users into the database during setup.

This ensures that after creating an account and logging in, a new user can immediately see other users to whom they can send meet requests.

---

# Starting the Application

From the project's root directory, run:

```bash
bash -x ./start.sh
```

The `-x` option displays the commands being executed by the script, making it possible to follow the provisioning and startup process.

> **Note:** The initial deployment may take several minutes because the virtual machines must be created and their required software and dependencies installed.

The script starts and configures all three VMs and launches the required application services.

---

# Redeploying the Application

The same startup command can be used for a clean redeployment:

```bash
bash -x ./start.sh
```

The startup script runs `vagrant destroy` before the `vagrant up` commands, meaning the existing VMs are destroyed and recreated as part of the deployment process.

---

# Deployment Verification

At the end of `start.sh`, two checks are performed to verify that the application has been deployed successfully.

### 1. Verify VM Status

```bash
vagrant status
```

This checks that the required Vagrant VMs have been created and are running.

### 2. Verify Application Functionality

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

`http://192.168.56.10:5173`

The application can then be manually tested using the user stories listed in the **Functionality** section above.

---

# Destroying the Environment

To stop and permanently remove the application's virtual machines, run the following command from the project directory:

```bash
vagrant destroy
```

Vagrant will ask for confirmation before destroying the VMs.
