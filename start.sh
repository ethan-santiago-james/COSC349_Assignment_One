#!/bin/bash
# Exit immediately if any command fails
set -e

# Clean up any existing VMs to ensure a fresh start
vagrant destroy -f web app db

# ==========================================
# 1. SET UP WEB VM (Frontend)
# ==========================================
vagrant up web

vagrant ssh web << 'EOF'
  sudo apt update && sudo apt install -y curl
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
  sudo apt install -y nodejs
  
  cd /vagrant/vue-frontend
  rm -rf node_modules package-lock.json
  mkdir -p /home/vagrant/frontend_node_modules_cache
  mkdir -p node_modules
  sudo mount --bind /home/vagrant/frontend_node_modules_cache /vagrant/vue-frontend/node_modules
  npm install
  
  # Run in background, redirect all outputs, and disown from the terminal session
  nohup npm run dev -- --host 0.0.0.0 > /home/vagrant/frontend.log 2>&1 &
  disown
EOF

# ==========================================
# 2. SET UP APP VM (REST API Backend)
# ==========================================
vagrant up app

vagrant ssh app << 'EOF'
  sudo apt update && sudo apt install -y curl
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
  sudo apt install -y nodejs
  
  cd /vagrant/REST_API
  rm -rf node_modules package-lock.json
  mkdir -p /home/vagrant/api_node_modules_cache
  mkdir -p node_modules
  sudo mount --bind /home/vagrant/api_node_modules_cache /vagrant/REST_API/node_modules
  npm install
  
  # Run in background, redirect all outputs, and disown from the terminal session
  nohup node express.js > /home/vagrant/api.log 2>&1 &
  disown
EOF

# ==========================================
# 3. SET UP DATABASE VM (PostgreSQL)
# ==========================================
vagrant up db

vagrant ssh db << 'EOF'
  sudo apt update 
  sudo apt-get install -y postgresql postgresql-contrib
  sudo systemctl enable postgresql
  
  # Dynamically find the installed configuration files (supports PG 14, 15, 16, etc.)
  PG_CONF=$(ls /etc/postgresql/*/main/postgresql.conf | head -n 1)
  PG_HBA=$(ls /etc/postgresql/*/main/pg_hba.conf | head -n 1)
  
  sudo sed -i "s/#\?listen_addresses =.*/listen_addresses = '*'/g" "$PG_CONF"
  
  if ! sudo grep -q "192.168.56.0/24" "$PG_HBA"; then
    echo "host    all             all             192.168.56.0/24         md5" | sudo tee -a "$PG_HBA"
  fi
  
  sudo systemctl restart postgresql
  
  # Set up users and databases without exploding if they already exist
  sudo -u postgres psql -c "CREATE USER appuser WITH PASSWORD 'password';" || true
  sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
  sudo -u postgres psql -c "DROP DATABASE IF EXISTS appdb;"
  sudo -u postgres psql -c "CREATE DATABASE appdb OWNER appuser;"
  sudo -u postgres psql -d appdb -f /vagrant/DB/schema.sql
EOF

# verification that the VMs are running and services are up
vagrant status
