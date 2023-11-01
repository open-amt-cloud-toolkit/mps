#*********************************************************************
# Copyright (c) Intel Corporation 2021
# SPDX-License-Identifier: Apache-2.0
#*********************************************************************/
#Multistage docker layer to isolate the git credentials
#First stage copy and install dependencies
FROM node:21-bullseye-slim@sha256:2c247f69ae354d692fcb76cab79cdbaa14485c0e0375a70efca9a98201b4ed29 as builder
LABEL license='SPDX-License-Identifier: Apache-2.0' \
      copyright='Copyright (c) Intel Corporation 2021'

WORKDIR /mps

EXPOSE 4433
EXPOSE 3000

COPY package*.json ./

# Install dependencies
RUN npm ci --unsafe-perm

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src/
COPY agent ./agent/
COPY .mpsrc ./

# Transpile TS -> JS
RUN npm run build
RUN npm prune --production

FROM alpine:latest@sha256:eece025e432126ce23f223450a0326fbebde39cdf496a85d8c016293fc851978

RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node 
RUN apk update && apk upgrade --no-cache && apk add nodejs --no-cache

COPY --from=builder  /mps/dist /mps/dist
# for healthcheck backwards compatibility
COPY --from=builder  /mps/dist/Healthcheck.js /dist/Healthcheck.js 
COPY --from=builder  /mps/.mpsrc /.mpsrc
COPY --from=builder  /mps/node_modules /mps/node_modules
COPY --from=builder  /mps/package.json /mps/package.json
# set the user to non-root
USER node
# Default Ports Used
EXPOSE 8080
EXPOSE 8081
EXPOSE 8082

CMD ["node", "/mps/dist/index.js"]