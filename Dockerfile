#*********************************************************************
# Copyright (c) Intel Corporation 2021
# SPDX-License-Identifier: Apache-2.0
#*********************************************************************/
#Multistage docker layer to isolate the git credentials
#First stage copy and install dependencies
FROM node:22-bullseye-slim@sha256:dabb7baa6f90d288473d86da189e7273ecc2c9904879d121b4ea28bc429ca6ed as builder

WORKDIR /mps

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

FROM alpine:latest@sha256:77726ef6b57ddf65bb551896826ec38bc3e53f75cdde31354fbffb4f25238ebd
LABEL license='SPDX-License-Identifier: Apache-2.0' \
      copyright='Copyright (c) Intel Corporation 2021'

RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node 
RUN apk update && apk upgrade --no-cache && apk add nodejs --no-cache

COPY --from=builder  /mps/dist /mps/dist
# for healthcheck backwards compatibility
COPY --from=builder  /mps/.mpsrc /.mpsrc
COPY --from=builder  /mps/node_modules /mps/node_modules
COPY --from=builder  /mps/package.json /mps/package.json
# set the user to non-root
USER node
# Default Ports Used
EXPOSE 4433
EXPOSE 3000

CMD ["node", "/mps/dist/index.js"]