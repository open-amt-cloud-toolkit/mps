#*********************************************************************
# Copyright (c) Intel Corporation 2021
# SPDX-License-Identifier: Apache-2.0
#*********************************************************************/
#Multistage docker layer to isolate the git credentials
#First stage copy and install dependencies
FROM node:23-bullseye-slim@sha256:f2f1e232f5736ea4b3d7a1f3fede9ad5c11f4546dbf63175576e5a9753db03c7 as builder

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

FROM alpine:latest@sha256:1e42bbe2508154c9126d48c2b8a75420c3544343bf86fd041fb7527e017a4b4a
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