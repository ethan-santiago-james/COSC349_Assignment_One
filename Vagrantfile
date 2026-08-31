Vagrant.configure("2") do |config|

  # Base Ubuntu image
  config.vm.box = "ubuntu/jammy64"
  config.ssh.insert_key = true
  
  config.vm.boot_timeout = 1000
  # -------------------------
  # VM 3: Database
  # -------------------------
  config.vm.define "db" do |db|
    db.vm.hostname = "db"

    db.vm.network "private_network",
      ip: "192.168.56.12"


    db.vm.synced_folder "./DB",
    "/vagrant/DB"
  end

   # -------------------------
  # VM 2: Application Server
  # -------------------------
  config.vm.define "app" do |app|
    app.vm.hostname = "app"

    app.vm.network "private_network",
      ip: "192.168.56.11"

    app.vm.synced_folder "./REST_API",
    "/vagrant/REST_API"
  end

  # -------------------------
  # VM 1: Web / API Gateway
  # -------------------------
  config.vm.define "web" do |web|
    
    web.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
      vb.cpus = 2
    end

    web.vm.hostname = "web"

    web.vm.network "private_network",
      ip: "192.168.56.10"

    web.vm.synced_folder "./vue-frontend",
    "/vagrant/vue-frontend"
  end

end