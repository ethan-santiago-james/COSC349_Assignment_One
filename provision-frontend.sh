#!/bin/bash

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get update
sudo apt-get install -y libatk1.0-0
# Verify installation
node --version
npm --version
npx --version

# Install frontend dependencies
cd /vagrant/UI/CollaborateFrontend
npm install

# Start Expo
npx expo start