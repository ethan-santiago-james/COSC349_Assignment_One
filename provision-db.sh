#!/usr/bin/env bash
set -e

apt-get update
apt-get install -y postgresql

sudo -u postgres psql -c "CREATE USER appuser WITH PASSWORD 'password';"
sudo -u postgres psql -c "CREATE DATABASE appdb OWNER appuser;"

# Execute your schema
sudo -u postgres psql -d appdb -f /vagrant/DB/schema.sql