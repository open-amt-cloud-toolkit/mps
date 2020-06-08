::/*********************************************************************
::* Copyright (c) Intel Corporation 2019
::* SPDX-License-Identifier: Apache-2.0
::**********************************************************************/
@ECHO off & setlocal enableextensions enabledelayedexpansion

:: Usage:
:: scripts\docker\run         : Starts the stable version
:: scripts\docker\run testing : Starts the testing version

:: Note: use lowercase names for the Docker images
SET DOCKER_IMAGE=rbachala/mps-microservice
SET STABLE_VERSION=v1

IF "%1"=="" goto :STABLE
IF "%1"=="testing" goto :TESTING

:STABLE
  echo Starting Danger Bay [%STABLE_VERSION%] ...
  docker run -it -p 4433:4433 -p 3000:3000 %DOCKER_IMAGE%:%STABLE_VERSION%
  goto :END


:END

endlocal