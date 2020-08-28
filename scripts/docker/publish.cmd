::/*********************************************************************
::* Copyright (c) Intel Corporation 2019
::* SPDX-License-Identifier: Apache-2.0
::**********************************************************************/
@ECHO off & setlocal enableextensions enabledelayedexpansion

:: Note: use lowercase names for the Docker images
SET DOCKER_IMAGE="rbachala/mps-microservice"
:: "testing" is the latest dev build, usually matching the code in the "master" branch
SET DOCKER_TAG=%DOCKER_IMAGE%:v1

docker push %DOCKER_TAG%

endlocal
