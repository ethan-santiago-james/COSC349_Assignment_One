#!/usr/bin/env bash

# Exit immediately if any command fails

# ==========================================
# 1. SET UP WEB VM (Frontend)
# ==========================================
vagrant up web
vagrant ssh web -c '
  sudo apt update && sudo apt install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash - && \
  sudo apt install -y nodejs && \
  cd /vagrant/UI/CollaborateFrontend && \
  rm -rf node_modules package-lock.json && \
  mkdir -p /home/vagrant/frontend_node_modules_cache && \
  mkdir -p node_modules && \
  sudo mount --bind /home/vagrant/frontend_node_modules_cache /vagrant/UI/CollaborateFrontend/node_modules && \
  NODE_OPTIONS="--max-old-space-size=1500" npm install --jobs=1 --no-audit --no-fund
'

# ==========================================
# 2. SET UP APP VM (REST API Backend)
# ==========================================
vagrant up app
vagrant ssh app -c '
  sudo apt update && sudo apt install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash - && \
  sudo apt install -y nodejs && \
  cd /vagrant/REST_API && \
  rm -rf node_modules package-lock.json && \
  mkdir -p /home/vagrant/api_node_modules_cache && \
  mkdir -p node_modules && \
  sudo mount --bind /home/vagrant/api_node_modules_cache /vagrant/REST_API/node_modules && \
  npm install
'

# ==========================================
# 3. SET UP DATABASE VM (PostgreSQL)
# ==========================================
vagrant up db
vagrant ssh db -c '
  sudo apt update && \
  sudo apt-get install -y postgresql postgresql-contrib && \
  sudo systemctl enable postgresql && \
  sudo sed -i "s/#\?listen_addresses =.*/listen_addresses = '\''*'\''/g" /etc/postgresql/14/main/postgresql.conf && \
  if ! sudo grep -q "192.168.56.0/24" /etc/postgresql/14/main/pg_hba.conf; then \
    echo "host    all             all             192.168.56.0/24         md5" | sudo tee -a /etc/postgresql/14/main/pg_hba.conf; \
  fi && \
  sudo systemctl restart postgresql@14-main && \
  sudo -u postgres psql -c "CREATE USER appuser WITH PASSWORD '\''password'\'';" && \
  sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '\''postgres'\'';" && \
  sudo -u postgres psql -c "CREATE DATABASE appdb OWNER appuser;" && \
  sudo -u postgres psql -d appdb -f /vagrant/DB/schema.sql
'
