```bash
#!/usr/bin/env bash

sudo apt update
sudo apt install -y curl

curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
cd /vagrant/UI/CollaborateFrontend
npm install
```