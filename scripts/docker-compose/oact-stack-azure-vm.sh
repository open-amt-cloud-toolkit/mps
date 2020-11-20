#/*********************************************************************
# Copyright (c) Intel Corporation 2020
# SPDX-License-Identifier: Apache-2.0
#**********************************************************************/
echo "export HTTP_PROXY, HTTPS_PROXY and DOCKER_LOGIN_PASSWORD ENV variables. Else the script will fail."

if [[ -z "$1" ]]; then
    echo "Usage: ./oact-stack-azure-vm.sh [resource-group-name] [region]"
    echo "Regions to use: westus, westus2"
    exit 1
fi

if [[ -z "$2" ]]; then
    echo "Usage: ./oact-stack-azure-vm.sh [resource-group-name] [region]"
    echo "Regions to use: westus, westus2"
    exit 1
fi

myDockerGroup=$1
myIPName="$1-ip"
myVMName="$1-vm"
region=$2
# echo $myVMName $myDockerGroup $myIPName

az group create --name $myDockerGroup --location $region >/dev/null
echo "Created Resource Group"

az vm create \
--resource-group $myDockerGroup \
--name $myVMName \
--image UbuntuLTS \
--admin-username azureuser \
--generate-ssh-keys \
--custom-data cloud-init.txt \
--public-ip-address $myIPName \
--public-ip-address-allocation static >/dev/null

echo "Created VM"

ipAddress=$(az network public-ip show \
  --resource-group $myDockerGroup \
  --name $myIPName \
  --query ipAddress \
  --output tsv)

cp -f .env.template .env

echo "" >> .env
echo "MPS_COMMON_NAME=$ipAddress" >> .env
echo "Updated ENV file with ip address"


az vm open-port \
--port 3000 \
--resource-group $myDockerGroup \
--name $myVMName \
--priority 110 >/dev/null

az vm open-port \
--port 4433 \
--resource-group $myDockerGroup \
--name $myVMName \
--priority 120 >/dev/null

az vm open-port \
--port 8080 \
--resource-group $myDockerGroup \
--name $myVMName \
--priority 130 >/dev/null

az vm open-port \
--port 8081 \
--resource-group $myDockerGroup \
--name $myVMName \
--priority 140 >/dev/null

echo "Opened ports for MPS and RPS"
echo "Wait 120 secs to give time to finish docker installation on Azure VM"
sleep 120s

ssh -o "StrictHostKeyChecking no" "azureuser@$ipAddress" sudo apt install --assume-yes docker-compose >/dev/null 2>&1
ssh -o "StrictHostKeyChecking no" "azureuser@$ipAddress" sudo apt install --assume-yes gnupg2 pass >/dev/null 2>&1

echo "Installed docker-compose"

scp -r ./data "azureuser@$ipAddress:~/data/" >/dev/null 2>&1
scp ./docker-compose-azure.yml "azureuser@$ipAddress:~/docker-compose.yml" >/dev/null 2>&1
scp ./.env "azureuser@$ipAddress:~/.env" >/dev/null 2>&1

echo "Copied docker-compose yml files"
ssh -o "StrictHostKeyChecking no" "azureuser@$ipAddress" sudo docker login -u vprodemo -p $DOCKER_LOGIN_PASSWORD >/dev/null 2>&1
ssh -o "StrictHostKeyChecking no" "azureuser@$ipAddress" sudo docker-compose up -d >/dev/null

echo "Started MPS and RPS on remote server at: $ipAddress"

