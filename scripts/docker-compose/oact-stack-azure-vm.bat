:: /*********************************************************************
:: Copyright (c) Intel Corporation 2020
:: SPDX-License-Identifier: Apache-2.0
:: **********************************************************************/
@echo off

if "" == "%~1" (
    echo "Usage: ./oact-stack-azure-vm.bat [resource-group-name] [region]"
    echo "Regions to use: westus, westus2"
    EXIT /B 1
)

if "" == "%~2" (
    echo "Usage: ./oact-stack-azure-vm.bat [resource-group-name] [region]"
    echo "Regions to use: westus, westus2"
    EXIT /B 1
)

set myDockerGroup=%1
set myIPName=%myDockerGroup%-ip
set myVMName=%myDockerGroup%-vm
set region=%2


call az group create --name %myDockerGroup% --location %region% >nul && (
  echo create Resource group successful
) || (
  echo Resourcegroup creation failed
  EXIT /B 1
)

call az vm create --resource-group %myDockerGroup% --name %myVMName% --image UbuntuLTS --admin-username azureuser --generate-ssh-keys --custom-data cloud-init.txt --public-ip-address %myIPName% --public-ip-address-allocation static >nul && (
  echo create VM successful
) || (
  echo create VM failed
  EXIT /B 1
)

call az network public-ip show --resource-group %myDockerGroup% --name %myIPName% --query ipAddress --output tsv > ip && (
  echo IP query successful
) || (
  echo IP query failed.
  EXIT /B 1
)

set /p ipAddress=<ip

xcopy /Y .env.template .env
@echo MPS_COMMON_NAME=%ipAddress% >> .env

echo Updated ENV file with ip address

call az vm open-port ^
--port 3000 ^
--resource-group %myDockerGroup% ^
--name %myVMName% ^
--priority 110 >nul && (
  echo "Opened port 3000"
) || (
  echo "Failed to open port 3000"
)

call az vm open-port ^
--port 4433 ^
--resource-group %myDockerGroup% ^
--name %myVMName% ^
--priority 120 >nul && (
  echo "Opened port 4433"
) || (
  echo "Failed to open port 4433"
)

call az vm open-port ^
--port 8080 ^
--resource-group %myDockerGroup% ^
--name %myVMName% ^
--priority 130 >nul && (
  echo "Opened port 8080"
) || (
  echo "Failed to open port 8080"
)

call az vm open-port ^
--port 8081 ^
--resource-group %myDockerGroup% ^
--name %myVMName% ^
--priority 140 >nul && (
  echo "Opened port 8081"
) || (
  echo "Failed to open port 8081"
)

timeout 120
echo "Came out of timeout 120"



call ssh -o "StrictHostKeyChecking no" azureuser@%ipAddress% sudo apt install --assume-yes docker-compose 
call ssh -o "StrictHostKeyChecking no" azureuser@%ipAddress% sudo apt install --assume-yes gnupg2 pass 

echo "Installed docker-compose"

call scp -r ./data azureuser@%ipAddress%:~/data/ 
call scp ./docker-compose-azure.yml azureuser@%ipAddress%:~/docker-compose.yml 
call scp ./.env azureuser@%ipAddress%:~/.env 

echo "Copied docker-compose yml files"
call ssh -o "StrictHostKeyChecking no" azureuser@%ipAddress% sudo docker login -u vprodemo -p %DOCKER_LOGIN_PASSWORD% 
call ssh -o "StrictHostKeyChecking no" azureuser@%ipAddress% sudo docker-compose up -d 

echo "Started MPS and RPS on remote server at: %ipAddress%"

