Vagrant.configure("2") do |config|

  config.vm.define "web" do |web|
    web.vm.box = "ubuntu/jammy64"
    web.vm.network "private_network", ip: "192.168.56.10"
    web.vm.synced_folder "/UI/CollaborateFrontend"
  end

  config.vm.define "api" do |api|
    api.vm.box = "ubuntu/jammy64"
    api.vm.network "private_network", ip: "192.168.56.11"
    api.vm.synced_folder = "/REST_API"
  end

  config.vm.define "db" do |db|
    db.vm.box = "ubuntu/jammy64"
    db.vm.network "private_network", ip: "192.168.56.12"
    db.vm.provision "shell", path: "provision-db.sh"
    db.vm.synced_folder = "DB/"
  end

end