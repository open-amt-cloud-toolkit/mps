#*********************************************************************
# Copyright (c) Intel Corporation 2020
# SPDX-License-Identifier: Apache-2.0
#*********************************************************************/
#Multistage docker layer to isolate the git credentials
#First stage copy and install dependencies
ARG BASE=node:12.19
FROM ${BASE} as builder

WORKDIR /mps-microservice

EXPOSE 4433
EXPOSE 3000

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src/
COPY webui/src ./webui/src
COPY webui/public ./webui/public
COPY webui/package*.json ./webui/
COPY webui/jsconfig.json ./webui/
COPY private/data.json ./private/ 
COPY agent ./agent/
COPY .mpsrc ./

# Install dependencies
RUN npm ci --unsafe-perm

# Transpile TS -> JS
#RUN npm run build
#RUN npm prune --production

#CMD [ "node", "./dist/index.js" ]
CMD [ "npm", "start" ]
