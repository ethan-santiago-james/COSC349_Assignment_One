```bash
#!/usr/bin/env bash
set -e

# -------------------------
# Install PostgreSQL
# -------------------------
sudo apt update
sudo apt-get install -y postgresql


sudo systemctl enable postgresql
sudo sed -i "s/#\?listen_addresses =.*/listen_addresses = '*'/g" /etc/postgresql/14/main/postgresql.conf

sudo systemctl restart postgresql@14-main

sudo systemctl start postgresql


# -------------------------
# Create database user
# -------------------------
sudo -u postgres psql -c \
  "CREATE USER appuser WITH PASSWORD 'password';"

sudo -u postgres psql -c \
  "ALTER USER postgres WITH PASSWORD 'postgres';"

# -------------------------
# Create database
# -------------------------
sudo -u postgres psql -c \
  "CREATE DATABASE appdb OWNER appuser;"


# -------------------------
# Execute database schema
# -------------------------
sudo -u postgres psql \
  -d appdb \
  -f /vagrant/DB/schema.sql
```
