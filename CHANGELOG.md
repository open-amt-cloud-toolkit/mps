<a name="v1.5.0"></a>
## [v1.5.0] - 2021-08-12
### Build
- fix tsconfig.json
- **deps:** bump express-validator from 6.12.0 to 6.12.1
- **deps:** bump mqtt from 4.2.6 to 4.2.8
- **deps:** bump path-parse from 1.0.6 to 1.0.7 ([#323](https://github.com/open-amt-cloud-toolkit/mps/issues/323))
- **deps:** bump node-vault from 0.9.21 to 0.9.22
- **deps:** bump ws from 7.5.0 to 7.5.1
- **deps:** bump pg from 8.6.0 to 8.7.1
- **deps:** bump ws from 7.5.1 to 7.5.2 ([#275](https://github.com/open-amt-cloud-toolkit/mps/issues/275))
- **deps:** bump ws from 7.5.2 to 7.5.3
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.17.3 to 14.17.4
- **deps-dev:** bump ts-node from 10.0.0 to 10.1.0
- **deps-dev:** bump [@types](https://github.com/types)/ws from 7.4.6 to 7.4.7
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.4 to 4.28.5
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.2 to 4.28.4
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.0 to 0.10.2
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@types](https://github.com/types)/pg from 8.6.0 to 8.6.1 ([#282](https://github.com/open-amt-cloud-toolkit/mps/issues/282))
- **deps-dev:** bump eslint from 7.30.0 to 7.31.0
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.23 to 26.0.24 ([#281](https://github.com/open-amt-cloud-toolkit/mps/issues/281))
- **deps-dev:** bump [@types](https://github.com/types)/express from 4.17.12 to 4.17.13
- **deps-dev:** bump typescript from 4.3.4 to 4.3.5 ([#272](https://github.com/open-amt-cloud-toolkit/mps/issues/272))
- **deps-dev:** bump [@types](https://github.com/types)/ws from 7.4.5 to 7.4.6 ([#273](https://github.com/open-amt-cloud-toolkit/mps/issues/273))
- **deps-dev:** bump [@types](https://github.com/types)/body-parser from 1.19.0 to 1.19.1 ([#279](https://github.com/open-amt-cloud-toolkit/mps/issues/279))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.1 to 4.28.2 ([#274](https://github.com/open-amt-cloud-toolkit/mps/issues/274))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump eslint from 7.29.0 to 7.30.0 ([#277](https://github.com/open-amt-cloud-toolkit/mps/issues/277))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.0 to 4.28.1
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.5 to 4.29.1 ([#322](https://github.com/open-amt-cloud-toolkit/mps/issues/322))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump ts-node from 10.1.0 to 10.2.0 ([#320](https://github.com/open-amt-cloud-toolkit/mps/issues/320))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.27.0 to 4.28.0
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump eslint from 7.28.0 to 7.29.0
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#321](https://github.com/open-amt-cloud-toolkit/mps/issues/321))
- **deps-dev:** bump eslint from 7.31.0 to 7.32.0 ([#316](https://github.com/open-amt-cloud-toolkit/mps/issues/316))
- **version:** bump to v1.5.0

### Docs
- update copyright label
- update copyright header
- **power actions:** added boot options api BREAKING CHANGE: added bootoptions api for power actions 100+ Fixes AB[#2777](https://github.com/open-amt-cloud-toolkit/mps/issues/2777)
- **security:** added SECURITY.md file
- **security:** added security.md file

### Feat
- **api:** add pagination following odata spec

### Fix
- **api:** devices can be filtered by tags
- **audit-log:** not find secret for device ([#313](https://github.com/open-amt-cloud-toolkit/mps/issues/313))
- **disconnect:** compose now works with db update on exit ([#312](https://github.com/open-amt-cloud-toolkit/mps/issues/312))
- **docs:** updated swagger doc with latest api changes ([#307](https://github.com/open-amt-cloud-toolkit/mps/issues/307))
- **startup:** mps now starts with tls_offload set to true

### Refactor
- **interfaces:** remove unused IAdminHandler and IAMTHandler
- **interfaces:** clearer separation of concerns is now reflected in interfaces
- **logging:** pr changes
- **logging:** removed key logging
- **logging:** updated log messages
- **logging:** removed excessive logging variables ([#263](https://github.com/open-amt-cloud-toolkit/mps/issues/263))
- **mqtt:** cleaner event publishing using static functions
- **power actions:** split out power actions 100+ into bootoptions BREAKING CHANGE: added bootoptions api for power actions 100+ fixes AB[#2751](https://github.com/open-amt-cloud-toolkit/mps/issues/2751)
- **types:** add better typing
- **utils:** convert interceptor to ts

### Test
- **power actions:** added boot options test fixes AB[#2905](https://github.com/open-amt-cloud-toolkit/mps/issues/2905)

<a name="v1.4.0"></a>
## [v1.4.0] - 2021-06-22
### Build
- add snyk config
- **dep:** missing atob dependency in package.json
- **deps:** bump express-validator from 6.10.1 to 6.11.1
- **deps:** bump ws from 7.4.5 to 7.4.6
- **deps:** add mqtt
- **deps:** bump ws from 7.4.6 to 7.5.0 ([#247](https://github.com/open-amt-cloud-toolkit/mps/issues/247))
- **deps:** bump express-validator from 6.11.1 to 6.12.0 ([#243](https://github.com/open-amt-cloud-toolkit/mps/issues/243))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump eslint from 7.27.0 to 7.28.0 ([#229](https://github.com/open-amt-cloud-toolkit/mps/issues/229))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#233](https://github.com/open-amt-cloud-toolkit/mps/issues/233))
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.9.9 to 0.10.0 ([#235](https://github.com/open-amt-cloud-toolkit/mps/issues/235))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.26.0 to 4.26.1 ([#234](https://github.com/open-amt-cloud-toolkit/mps/issues/234))
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.17.2 to 14.17.3 ([#236](https://github.com/open-amt-cloud-toolkit/mps/issues/236))
- **deps-dev:** bump typescript from 4.2.4 to 4.3.2
- **deps-dev:** bump ts-node from 9.1.1 to 10.0.0
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.26.1 to 4.27.0 ([#245](https://github.com/open-amt-cloud-toolkit/mps/issues/245))
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.17.1 to 14.17.2
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.25.0 to 4.26.0
- **deps-dev:** bump eslint-plugin-import from 2.23.3 to 2.23.4
- **deps-dev:** bump eslint-config-standard from 16.0.2 to 16.0.3
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#244](https://github.com/open-amt-cloud-toolkit/mps/issues/244))
- **deps-dev:** bump [@types](https://github.com/types)/ws from 7.4.4 to 7.4.5 ([#249](https://github.com/open-amt-cloud-toolkit/mps/issues/249))
- **deps-dev:** bump typescript from 4.3.2 to 4.3.4 ([#248](https://github.com/open-amt-cloud-toolkit/mps/issues/248))
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.17.0 to 14.17.1
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.24.0 to 4.25.0
- **deps-dev:** bump [@types](https://github.com/types)/pg from 7.14.11 to 8.6.0
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.9.7 to 0.9.9
- **deps-dev:** bump eslint-plugin-import from 2.23.2 to 2.23.3
- **deps-dev:** bump eslint from 7.26.0 to 7.27.0
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.23.0 to 4.24.0 ([#200](https://github.com/open-amt-cloud-toolkit/mps/issues/200))
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#201](https://github.com/open-amt-cloud-toolkit/mps/issues/201))
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.45 to 14.17.0
- **deps-dev:** bump eslint-plugin-import from 2.22.1 to 2.23.2
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.22.0 to 4.23.0
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.44 to 14.14.45
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump ts-jest from 26.5.5 to 26.5.6
- **deps-dev:** bump eslint from 7.25.0 to 7.26.0
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.43 to 14.14.44
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **version:** bump to v1.4.0

### Ci
- add codeQL scan

### Docs
- **api:** additional edits
- **api:** remove metadata
- **api:** typo fix
- **api:** remove metadata
- **package.json:** additional information
- **swagger:** updated swagger docs for 1.3

### Feat
- **mqtt:** adds event logging to mps
- **reverseproxy:** updated DB amd api's to store the connection status ([#189](https://github.com/open-amt-cloud-toolkit/mps/issues/189))
- **security:** add JWT verification to websocket connection

### Fix
- **api:** only update the columns requested for change ([#257](https://github.com/open-amt-cloud-toolkit/mps/issues/257))
- **config:** removed use_allowlist from config ([#231](https://github.com/open-amt-cloud-toolkit/mps/issues/231))
- **dockerfile:** send signals to node instead of npm
- **scaling:** Revert scaling changes ([#198](https://github.com/open-amt-cloud-toolkit/mps/issues/198))

### Refactor
- **auth:** check for jwt secret and mps credentials ([#238](https://github.com/open-amt-cloud-toolkit/mps/issues/238))

### Test
- **auth:** test device auth ([#246](https://github.com/open-amt-cloud-toolkit/mps/issues/246))

### BREAKING CHANGE

- JWT is now required for KVM/SOL connections
- db schema added new column for mps username
- global credentials have been removed for MPS
- Environment Variables removed for username, password, and global credentials, use_allowlist

<a name="v1.3.0"></a>
## [v1.3.0] - 2021-05-06

### Build
- bump package.json version to 1.3.0
- **deps:** bump express-validator from 6.10.0 to 6.10.1
- **deps:** bump redis from 3.0.2 to 3.1.0
- **deps:** bump pg from 8.5.1 to 8.6.0
- **deps:** bump ws from 7.4.4 to 7.4.5
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.37 to 14.14.39
- **deps-dev:** bump eslint from 7.24.0 to 7.25.0
- **deps-dev:** bump ts-jest from 26.5.4 to 26.5.5
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.39 to 14.14.41
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.22 to 26.0.23
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.41 to 14.14.43
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.21.0 to 4.22.0
- **deps-dev:** bump eslint from 7.23.0 to 7.24.0
- **deps-dev:** bump eslint-plugin-promise from 4.3.1 to 5.1.0
- **deps-dev:** bump typescript from 4.2.3 to 4.2.4
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.20.0 to 4.21.0
- **dockerfile:** add license label

### Ci
- add test coverage requirement

### Docs
- add changelog
- **api:** pr updates
- **api:** corrected case
- **api:** updated device and status query
- **api:** update swagger definition
- **swagger:** add login API info

### Feat
- **api:** added device get ([#167](https://github.com/open-amt-cloud-toolkit/mps/issues/167))


### Fix
- **api:** fix for jwt token expiration time
- **metadata:** update SQL column name to hostname

### Refactor
- **api:** PR162 updates
- **api:** **BREAKING CHANGE:** align mps and rps api architecture. See [release notes](https://open-amt-cloud-toolkit.github.io/docs/1.3/release-notes/) for complete details. 
- **proxy:** remove tls from app. 

### Test
- **api:** move host port to postman env
- **api:** update API tests


<a name="v1.2.0"></a>
## [v1.2.0] - 2021-04-02
### Build
- **dep:** force lodash to latest
- **deps:** bump ws from 7.4.2 to 7.4.3
- **deps:** bump ws from 7.4.3 to 7.4.4
- **deps:** add express-validator
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.35 to 14.14.36
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.36 to 14.14.37
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.21 to 26.0.22
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.18.0 to 4.19.0
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.20 to 26.0.21
- **deps-dev:** bump ts-jest from 26.5.3 to 26.5.4
- **deps-dev:** bump eslint from 7.22.0 to 7.23.0
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.17.0 to 4.18.0
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.34 to 14.14.35
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.33 to 14.14.34
- **deps-dev:** bump eslint from 7.21.0 to 7.22.0
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.32 to 14.14.33
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.16.1 to 4.17.0
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.31 to 14.14.32
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.19.0 to 4.20.0
- **deps-dev:** bump ts-jest from 26.5.2 to 26.5.3
- **deps-dev:** bump [@types](https://github.com/types)/pg from 7.14.10 to 7.14.11
- **deps-dev:** bump typescript from 4.2.2 to 4.2.3
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.15.2 to 4.16.1
- **deps-dev:** bump eslint from 7.20.0 to 7.21.0
- **deps-dev:** bump ts-jest from 26.5.1 to 26.5.2
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump typescript from 4.1.5 to 4.2.2
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.15.1 to 4.15.2
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.28 to 14.14.31
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.15.0 to 4.15.1
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.22 to 14.14.27
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.27 to 14.14.28
- **deps-dev:** bump typescript from 3.9.7 to 4.1.5
- **deps-dev:** bump eslint-plugin-promise from 4.2.1 to 4.3.1
- **deps-dev:** bump ts-jest from 26.5.0 to 26.5.1
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump eslint from 7.19.0 to 7.20.0
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.14.2 to 4.15.0
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **docker:** update node image to 14-buster-slim

### Ci
- add initial jenkinsfile
- enforce lint on PR merge ([#99](https://github.com/open-amt-cloud-toolkit/mps/issues/99))

### Docs
- **api:** update swagger to include tags
- **api:** add swagger definition
- **api:** add swagger documentation

### Feat
- **api:** add endpoint /stats
- **metadata:** add postgress db for storing device metadata ([#108](https://github.com/open-amt-cloud-toolkit/mps/issues/108))
- **scaling:** add scaling support for mps ([#139](https://github.com/open-amt-cloud-toolkit/mps/issues/139))
- **tags:** add query filter for tags on device metadata

### Fix
- wrong return type
- **cira:** removed log statements; corrected case ([#146](https://github.com/open-amt-cloud-toolkit/mps/issues/146))
- **stats:** ensure disconnected count is non-negative
- **webserver:** request query params type check

### Refactor
- added missing let in for loops
- **lint:** apply new-cap rule ([#92](https://github.com/open-amt-cloud-toolkit/mps/issues/92))
- **lint:** apply new-cap, no-unused-var, naming-convention rule
- **lint:**  apply eqeqeq rule
- **lint:** apply restrict-plus-operator
- **lint:** no-var-requires ([#93](https://github.com/open-amt-cloud-toolkit/mps/issues/93))
- **lint:** apply no-path-concat rule ([#91](https://github.com/open-amt-cloud-toolkit/mps/issues/91))
- **lint:** apply [@typescript](https://github.com/typescript)-eslint/explicit-function-return-type rule
- **lint:** autofix formatting
- **metadata:** rename device db references to metadata

### Test
- **api:** add basic api tests


<a name="v1.1.0"></a>
## [v1.1.0] - 2021-02-11
### Build
- **deps:** update jest to 26.6.0
- **deps-dev:** bump eslint from 7.17.0 to 7.19.0
- **deps-dev:** bump ts-node from 8.10.2 to 9.1.1
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.8.7 to 0.9.7
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.12.0 to 4.14.2
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.20 to 14.14.22
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin
- **deps-dev:** bump ts-jest from 26.4.4 to 26.5.0
- **deps-dev:** bump eslint-config-standard-with-typescript

### Ci
- add latest tag to docker image
- add dependabot config
- add types for conventional commits
- add docker ci
- update docker build
- Update docker-image.yml
- remove snyk from github actions
- **docs:** remove automation

### Docs
- add changelog
- add status badges
- add release disclaimer
- remove from mps and move to docs repo

### Feat
- **cors:** Add support for CORS

### Fix
- cors support for cookies
- upgrade node-vault from 0.9.20 to 0.9.21
- upgrade ws from 7.3.1 to 7.4.0
- **CORS:** added support to multiple origins
- **api:** changed response for logout api
- **cors:** allow setting of cors regardless of authmode

### Refactor
- default allowlist to false in config
- remove webui pieces
- migrate from internal
- **docker:** migrate docker scripts to open-amt-cloud-toolkit
- **eslint:** add linting to code
- **webui:** move webui


<a name="v1.0.0"></a>
## v1.0.0 - 2020-11-20
### Build
- add condition for master to publish docs
- optimize dockerfile

### Ci
- license and copyright added
- add build automation w/ github actions
- build automation for documentation

### Docs
- format vault document
- update docker to reflect vault in dev mode
- remove prev/next guidance
- fix broken link in localization.md
- fix broken link
- link fix

### Fix
- **docker:** build time taking too long

### Refactor
- **docker:** remove build pre-build step
- **docker:** optimize dockerfile

