#*********************************************************************
# Copyright (c) Intel Corporation 2020
# SPDX-License-Identifier: Apache-2.0
#*********************************************************************/

ARG BASE=node:latest
FROM ${BASE} as builder
WORKDIR /mps-microservice

COPY package*.json ./
RUN npm install

FROM node:latest
WORKDIR /mps-microservice

COPY --from=builder /mps-microservice/node_modules ./node_modules
COPY . .
EXPOSE 4433
EXPOSE 3000
CMD [ "npm", "start" ]
