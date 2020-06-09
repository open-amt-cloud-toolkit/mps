:: /*********************************************************************
:: Copyright (c) Intel Corporation 2020
:: SPDX-License-Identifier: Apache-2.0
:: **********************************************************************/
echo off

NET SESSION >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    ECHO admin rights found! 
) ELSE (
    ECHO must be ran as an admin!
    EXIT /B 1
)

set adminusername=admin
set adminpassword=APIKEYFORMPS123!
set mpsapikey=APIKEYFORMPS123!
set mpspassword=P@ssw0rd
set rpsapikey=APIKEYFORRPS123!

call kubectl create secret generic mpsweb --from-literal=adminusername=%adminusername% --from-literal=adminuserpassword=%adminpassword% && (
  echo mpsweb secret created successfully
) || (
  echo mpsweb secret creation failed
  EXIT /B 1
)

call kubectl create secret generic mpsapi --from-literal=x-api-key=%mpsapikey% && (
 echo mpsapi secret created successfully
) || (
  echo mpsapi secret creation failed
  EXIT /B 1
)

call kubectl create secret generic mpscreds --from-literal=mpspassword=%mpspassword% && (
 echo mpscreds secret created successfully
) || (
  echo mpscreds secret creation failed
  EXIT /B 1
)

call kubectl create secret generic rpsapi --from-literal=x-api-key=%rpsapikey% && (
 echo rpsapi secret created successfully
) || (
  echo rpsapi secret creation failed
  EXIT /B 1
)

call kubectl create secret generic regcred --from-file=.dockerconfigjson=config.json --type=kubernetes.io/dockerconfigjson && (
 echo repo secret created successfully
) || (
  echo repo secret creation failed
  EXIT /B 1
)