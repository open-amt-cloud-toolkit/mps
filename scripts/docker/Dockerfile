# /*********************************************************************
# * Copyright (c) Intel Corporation 2019
# * SPDX-License-Identifier: Apache-2.0
# **********************************************************************/
FROM node:10-alpine
COPY ./ /app/
WORKDIR /app

RUN echo "Installing node packages ..." && npm install

LABEL Tags="Intel,vPRO,mps"

ARG user=app

RUN addgroup $user && adduser -D -G $user $user && chown -R $user:$user /app && chown -R $user:$user /app

EXPOSE 4433 3000

ENTRYPOINT ["/bin/sh", "/app/run.sh"]

USER $user