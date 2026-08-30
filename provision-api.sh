```bash
#!/usr/bin/env bash
set -e

# -------------------------
# Install Docker
# -------------------------
apt-get update
apt-get install -y docker.io

systemctl enable docker
systemctl start docker


# -------------------------
# Install Node.js and npm
# -------------------------
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs


# -------------------------
# Verify installation
# -------------------------
node --version
npm --version


# -------------------------
# Install API dependencies
# -------------------------
cd /vagrant/REST_API

npm install

```
