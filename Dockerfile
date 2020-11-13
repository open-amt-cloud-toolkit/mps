#*********************************************************************
# Copyright (c) Intel Corporation 2020
# SPDX-License-Identifier: Apache-2.0
#*********************************************************************/
#Multistage docker layer to isolate the git credentials
#First stage copy and install dependencies
ARG BASE=node:latest
FROM ${BASE} as builder
WORKDIR /mps-microservice

COPY package*.json ./
COPY webui/package*.json ./webui/
RUN npm ci --unsafe-perm

#Second stage ignores all the git credentials and copies the node-modules
FROM node:latest
WORKDIR /mps-microservice

COPY --from=builder /mps-microservice/node_modules ./node_modules
COPY --from=builder /mps-microservice/webui/node_modules ./webui/node_modules
COPY . .
COPY package*.json ./
COPY src ./src/
COPY tsconfig.json ./
COPY private/data.json ./private/ 
COPY agent ./agent/
COPY .mpsrc ./

EXPOSE 4433
EXPOSE 3000
CMD [ "npm", "start" ]
