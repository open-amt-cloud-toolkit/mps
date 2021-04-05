<a name="v1.2.0"></a>
## v1.2.0

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
