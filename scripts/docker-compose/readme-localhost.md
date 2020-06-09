# Install Open AMT Cloud Toolkit Server Stack on localhost

## Pre-reqs
1.	Docker for Desktop (for Windows)  - (https://docs.docker.com/docker-for-windows/install/)

## Steps to run Docker-compose

### Run docker-compose

``` shell
cd scripts\docker-compose
xcopy /Y .env.sample .env
docker-compose up -d
```

### Check logs

``` shell
docker-compose logs
```

