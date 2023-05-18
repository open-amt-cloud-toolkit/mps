<a name="2.8.4"></a>
## [2.8.4] - 2023-05-18
### Build
- update changelog and version to v2.8.3 (#2900d0a) 
- **deps:** bump pg from 8.10.0 to 8.11.0 (#8645f8f) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#4417572) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#8c01745) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 20.1.2 to 20.1.3 ([#904](https://github.com/open-amt-cloud-toolkit/mps/issues/904)) (#81c2012) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 20.1.3 to 20.1.5 (#15df302) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#94f257f) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.59.5 to 5.59.6 (#afba336) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 20.1.1 to 20.1.2 (#9def3b2) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.59.2 to 5.59.5 (#f38e829) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#39b1ff5) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 20.1.0 to 20.1.1 (#5cd85b5) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 20.1.5 to 20.1.7 (#4ff979f) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.16.3 to 20.1.0 ([#895](https://github.com/open-amt-cloud-toolkit/mps/issues/895)) (#2ef3f38) 
- **deps-dev:** bump eslint from 8.39.0 to 8.40.0 ([#894](https://github.com/open-amt-cloud-toolkit/mps/issues/894)) (#158123b) 

### Fix
- changes to reset to PXE (#4da936b) 

<a name="2.8.3"></a>
## [2.8.3] - 2023-05-05
### Build
- update changelog and version to v2.8.3 (#f21e1aa) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages ([#885](https://github.com/open-amt-cloud-toolkit/mps/issues/885)) (#73c605f) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages ([#871](https://github.com/open-amt-cloud-toolkit/mps/issues/871)) (#249b486) 
- **deps:** bump xml2js from 0.4.23 to 0.5.0 (#b7eb3a1) 
- **deps:** bump express-validator from 6.15.0 to 7.0.1 ([#876](https://github.com/open-amt-cloud-toolkit/mps/issues/876)) (#87788c8) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.12 to 18.15.13 ([#879](https://github.com/open-amt-cloud-toolkit/mps/issues/879)) (#31b9ccd) 
- **deps-dev:** bump eslint from 8.38.0 to 8.39.0 ([#880](https://github.com/open-amt-cloud-toolkit/mps/issues/880)) (#3902d92) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#882](https://github.com/open-amt-cloud-toolkit/mps/issues/882)) (#f7eea0e) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.13 to 18.16.1 ([#884](https://github.com/open-amt-cloud-toolkit/mps/issues/884)) (#74ddc8c) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.59.0 to 5.59.1 ([#881](https://github.com/open-amt-cloud-toolkit/mps/issues/881)) (#4c4d54d) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.16.1 to 18.16.2 ([#887](https://github.com/open-amt-cloud-toolkit/mps/issues/887)) (#c700ab3) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.16.2 to 18.16.3 ([#889](https://github.com/open-amt-cloud-toolkit/mps/issues/889)) (#fc71ae7) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.11 to 18.15.12 ([#878](https://github.com/open-amt-cloud-toolkit/mps/issues/878)) (#5a52fff) 
- **deps-dev:** bump jest-junit from 15.0.0 to 16.0.0 ([#873](https://github.com/open-amt-cloud-toolkit/mps/issues/873)) (#8b5478a) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.58.0 to 5.59.0 ([#874](https://github.com/open-amt-cloud-toolkit/mps/issues/874)) (#a3d8f65) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#875](https://github.com/open-amt-cloud-toolkit/mps/issues/875)) (#5a54d42) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#890](https://github.com/open-amt-cloud-toolkit/mps/issues/890)) (#25d410c) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.59.1 to 5.59.2 ([#891](https://github.com/open-amt-cloud-toolkit/mps/issues/891)) (#1c35806) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#be84f69) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.57.1 to 5.58.0 (#96de3f7) 
- **deps-dev:** bump eslint from 8.37.0 to 8.38.0 (#cd7a544) 
- **docker:** ensure healthcheck remains in same location ([#872](https://github.com/open-amt-cloud-toolkit/mps/issues/872)) (#af9a9d9) 
- **docker:** reduce docker image size and reduce vulnerability surface area (#83576e3) 

### Ci
- **deps:** bump codecov to 3.1.3 (#6f3b1ed) 

### Fix
- update kvmConnect property on CIRA connection close ([#888](https://github.com/open-amt-cloud-toolkit/mps/issues/888)) (#37307fe) 
- Device deletion request from RPS ([#886](https://github.com/open-amt-cloud-toolkit/mps/issues/886)) (#dd483d6) 


<a name="2.8.2"></a>
## [2.8.2] - 2023-04-05
### Build
- update package.json to v2.8.2 (#7cd642b) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages ([#858](https://github.com/open-amt-cloud-toolkit/mps/issues/858)) (#de1889b) 
- **deps:** bump pg from 8.9.0 to 8.10.0 ([#835](https://github.com/open-amt-cloud-toolkit/mps/issues/835)) (#1b3bb7c) 
- **deps:** bump ws from 8.12.1 to 8.13.0 ([#839](https://github.com/open-amt-cloud-toolkit/mps/issues/839)) (#0449193) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#474b0f5) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.55.0 to 5.56.0 (#fb34d5d) 
- **deps-dev:** bump eslint from 8.36.0 to 8.37.0 (#57d21bf) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.56.0 to 5.57.0 ([#857](https://github.com/open-amt-cloud-toolkit/mps/issues/857)) (#82f2312) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.7 to 18.15.10 ([#856](https://github.com/open-amt-cloud-toolkit/mps/issues/856)) (#b99b745) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#855](https://github.com/open-amt-cloud-toolkit/mps/issues/855)) (#a472ed3) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.6 to 18.15.7 ([#853](https://github.com/open-amt-cloud-toolkit/mps/issues/853)) (#5202f87) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.5 to 18.15.6 ([#852](https://github.com/open-amt-cloud-toolkit/mps/issues/852)) (#b7fbddf) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.3 to 18.15.5 (#40e5e8b) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.10 to 18.15.11 (#bbbc045) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#e870d36) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 1.3.1 to 1.3.2 ([#863](https://github.com/open-amt-cloud-toolkit/mps/issues/863)) (#4ace390) 
- **deps-dev:** bump eslint-config-standard-with-typescript (#7bd9b31) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.15.0 to 18.15.3 (#05511b3) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.54.1 to 5.55.0 ([#844](https://github.com/open-amt-cloud-toolkit/mps/issues/844)) (#e9950e9) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#842](https://github.com/open-amt-cloud-toolkit/mps/issues/842)) (#d34006c) 
- **deps-dev:** bump eslint from 8.35.0 to 8.36.0 ([#840](https://github.com/open-amt-cloud-toolkit/mps/issues/840)) (#99f7b37) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.57.0 to 5.57.1 ([#862](https://github.com/open-amt-cloud-toolkit/mps/issues/862)) (#47aa9e5) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.14.6 to 18.15.0 ([#838](https://github.com/open-amt-cloud-toolkit/mps/issues/838)) (#0f0fcdd) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.14.4 to 18.14.6 ([#833](https://github.com/open-amt-cloud-toolkit/mps/issues/833)) (#2f7a828) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#834](https://github.com/open-amt-cloud-toolkit/mps/issues/834)) (#68647d3) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#861](https://github.com/open-amt-cloud-toolkit/mps/issues/861)) (#d48d9e8) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.54.0 to 5.54.1 ([#836](https://github.com/open-amt-cloud-toolkit/mps/issues/836)) (#ae0173d) 

### Fix
- add missing tenantid in deactivate call ([#841](https://github.com/open-amt-cloud-toolkit/mps/issues/841)) (#7724a60) 
- exclude test.js files from custom middleware (#fb5e1f2) 

<a name="2.8.1"></a>
## [2.8.1] - 2023-03-03
### Build
- update to v2.8.1, update changelog (#d66c4b1) 
- updated Node to 18 ([#815](https://github.com/open-amt-cloud-toolkit/mps/issues/815)) (#19f6b91) 
- **deps:** bump exponential-backoff from 3.1.0 to 3.1.1 (#0fc033b) 
- **deps:** bump ws from 8.12.0 to 8.12.1 ([#809](https://github.com/open-amt-cloud-toolkit/mps/issues/809)) (#d11821c) 
- **deps:** bump express-validator from 6.14.3 to 6.15.0 ([#814](https://github.com/open-amt-cloud-toolkit/mps/issues/814)) (#9f7d7b6) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#21a2b80) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.14.2 to 18.14.4 (#5803827) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.52.0 to 5.53.0 (#13a52c5) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.14.0 to 18.14.1 ([#822](https://github.com/open-amt-cloud-toolkit/mps/issues/822)) (#6a3b9e8) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.14.1 to 18.14.2 (#c2da1a4) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.13.0 to 18.14.0 (#607fc8a) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#818](https://github.com/open-amt-cloud-toolkit/mps/issues/818)) (#af9da31) 
- **deps-dev:** bump eslint from 8.34.0 to 8.35.0 (#9bff6db) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.53.0 to 5.54.0 (#e48de73) 
- **deps-dev:** bump eslint from 8.33.0 to 8.34.0 ([#808](https://github.com/open-amt-cloud-toolkit/mps/issues/808)) (#27b7dce) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#810](https://github.com/open-amt-cloud-toolkit/mps/issues/810)) (#02f3121) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#09bcf1a) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.51.0 to 5.52.0 ([#811](https://github.com/open-amt-cloud-toolkit/mps/issues/811)) (#31d9ec0) 

### Docs
- add discord info ([#830](https://github.com/open-amt-cloud-toolkit/mps/issues/830)) (#52e5535) 

### Fix
- upated IsecretManagerService ([#829](https://github.com/open-amt-cloud-toolkit/mps/issues/829)) (#702e678) 
- **health:** fix vault health check failure when in HA mode (#835a2db) 

<a name="2.8.0"></a>
## [2.8.0] - 2023-02-16
### Build
- **deps:** bump express-validator from 6.14.2 to 6.14.3 ([#789](https://github.com/open-amt-cloud-toolkit/mps/issues/789)) (#aa595af) 
- **deps:** bump got from 11.8.5 to 11.8.6 (#eae4263) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#7d41361) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#04f3266) 
- **deps:** bump consul from 1.1.0 to 1.2.0 (#b153615) 
- **deps:** bump json5 from 1.0.1 to 1.0.2 (#2b84f5a) 
- **deps:** bump http-cache-semantics from 4.1.0 to 4.1.1 ([#802](https://github.com/open-amt-cloud-toolkit/mps/issues/802)) (#14892e5) 
- **deps:** bump ws from 8.11.0 to 8.12.0 (#08791e2) 
- **deps:** update wsman-messages from 3.2.0 to 5.0.0 ([#776](https://github.com/open-amt-cloud-toolkit/mps/issues/776)) (#70687e9) 
- **deps:** bump pg from 8.8.0 to 8.9.0 ([#795](https://github.com/open-amt-cloud-toolkit/mps/issues/795)) (#d26cb2b) 
- **deps-dev:** bump eslint-config-standard-with-typescript from 26.0.0 to 34.0.0 ([#801](https://github.com/open-amt-cloud-toolkit/mps/issues/801)) (#1952a7c) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#ce53f9b) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.48.2 to 5.49.0 (#994f2f1) 
- **deps-dev:** bump typescript from 4.9.4 to 4.9.5 ([#797](https://github.com/open-amt-cloud-toolkit/mps/issues/797)) (#ecc0dca) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.48.1 to 5.48.2 (#bb484f7) 
- **deps-dev:** bump eslint-plugin-import from 2.26.0 to 2.27.5 (#40e4f6a) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#c49c541) 
- **deps-dev:** bump eslint from 8.31.0 to 8.32.0 (#8220d85) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.48.0 to 5.48.1 (#52b2621) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#800](https://github.com/open-amt-cloud-toolkit/mps/issues/800)) (#4dcf1c9) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#7f385f3) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 8.5.3 to 8.5.4 (#d695d5a) 
- **deps-dev:** bump [@types](https://github.com/types)/express from 4.17.15 to 4.17.17 ([#803](https://github.com/open-amt-cloud-toolkit/mps/issues/803)) (#386a654) 
- **deps-dev:** bump [@types](https://github.com/types)/pg from 8.6.5 to 8.6.6 (#99d3290) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.11.16 to 18.11.18 (#86bb332) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.11.15 to 18.11.16 (#04eff5c) 
- **deps-dev:** bump eslint from 8.32.0 to 8.33.0 ([#798](https://github.com/open-amt-cloud-toolkit/mps/issues/798)) (#e668df2) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.11.12 to 18.11.15 (#4b2cc6c) 
- **deps-dev:** bump [@types](https://github.com/types)/express from 4.17.14 to 4.17.15 (#4c7d154) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 18.11.18 to 18.13.0 ([#807](https://github.com/open-amt-cloud-toolkit/mps/issues/807)) (#8a410ff) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 5.49.0 to 5.51.0 ([#806](https://github.com/open-amt-cloud-toolkit/mps/issues/806)) (#ff01169) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#804](https://github.com/open-amt-cloud-toolkit/mps/issues/804)) (#945fa60) 
- **deps-dev:** bump typescript from 4.9.3 to 4.9.4 (#85f0e6c) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 16.18.4 to 18.11.12 (#625ddf7) 

### Ci
- fix changelog build (#1642f5a) 
- add ossf action (#fc48fbb) 

### Docs
- add ossf badge to readme (#1c6ddaa) 

### Feat
- **api:** enhance multitenancy support ([#747](https://github.com/open-amt-cloud-toolkit/mps/issues/747)) (#ae25c87) 
- **api:** add support for custom middleware (#11746a7) 

### Fix
- **api:** ensure middleware is loaded from correct directory (#2870b9c) 

### Refactor
- upgrade lint dependencies and add recommended rules (#88a14f4) 

<a name="2.7.0"></a>
## [2.7.0] - 2022-12-08
### Build
- update to v2.7.0, update changelog (#2821bb9) 
- **deps-dev:** bump typescript from 4.8.4 to 4.9.3 ([#730](https://github.com/open-amt-cloud-toolkit/mps/issues/730)) (#803d9bd) 
- **deps-dev:** bump jest-junit from 14.0.1 to 15.0.0 (#8a24331) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 1.3.0 to 1.3.1 (#249317a) 

### Ci
- add manual dispatch (#9fb95a7) 
- rename license-header to header (#06bc73e) 
- update checkout to v3, update semantic pr checks ([#737](https://github.com/open-amt-cloud-toolkit/mps/issues/737)) (#7e6fc40) 
- add azure boards sync (#26ed7db) 
- add projects sync to mps (#fcc823d) 
- **gh-actions:** add scopes ([#739](https://github.com/open-amt-cloud-toolkit/mps/issues/739)) (#2be2aed) 

### Feat
- **db:** maintenance sync hostname information (#fe29627) 
- **health:** add waits for db and vault to be available to respond to request (#8a5d5a3) 

### Fix
- issue [#741](https://github.com/open-amt-cloud-toolkit/mps/issues/741) - don't send CHANNEL_CLOSE more than once (#488a615) 
- issue [#743](https://github.com/open-amt-cloud-toolkit/mps/issues/743) - close channel on Request 'aborted' event (#c29d80d) 
- issue [#729](https://github.com/open-amt-cloud-toolkit/mps/issues/729) and use Buffer rather than string for CIRAChannel's sendBuffer (#de565d1) 
- issue 668 - ensure CIM_KVMRedirectionSAP is present before using it (#fd974f8) 
- issue [#661](https://github.com/open-amt-cloud-toolkit/mps/issues/661) - don't try to access a zero length body ([#734](https://github.com/open-amt-cloud-toolkit/mps/issues/734)) (#98c6a3f) 
- InstanceID and ElementName shouldn't be treated as numeric if they have a leading zero (#fc56834) 
- **api:** getHardwareInfo pulls correct status for CIM_PhysicalMemory ([#731](https://github.com/open-amt-cloud-toolkit/mps/issues/731)) (#38b1759) 
- **auth:** handle qop="auth-int, auth" header ([#722](https://github.com/open-amt-cloud-toolkit/mps/issues/722)) (#42d8fb3) 
- **db:** ensures dbInstance is a singleton ([#727](https://github.com/open-amt-cloud-toolkit/mps/issues/727)) (#04096be) 
- **redirection:** ensure nonce is used correctly ([#728](https://github.com/open-amt-cloud-toolkit/mps/issues/728)) (#76a7c80) 

### Refactor
- **cira:** increases stability of calls to a device (#551a540) 

<a name="2.6.0"></a>
## [2.6.0] - 2022-11-07
### Build
- update version to v2.6.0 (#085d43e) 
- **deps:** bump ws from 8.10.0 to 8.11.0 (#2ed9280) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#90b4ef4) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#2fb4322) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#d5fae80) 
- **deps:** bump ws from 8.9.0 to 8.10.0 (#a469e6a) 
- **deps:** bump express from 4.18.1 to 4.18.2 (#4f8f6fe) 
- **deps:** bump consul from 1.0.1 to 1.1.0 (#b8b22a5) 
- **deps:** bump ws from 8.8.1 to 8.9.0 (#3921321) 
- **deps-dev:** bump typescript from 4.8.3 to 4.8.4 (#d581dc1) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 1.0.5 to 1.3.0 (#c661620) 
- **docker:** change base image to use bullseye-slim instead of buster-slim (#91bfbf3) 

### Feat
- **api:** add endpoint to unprovision devices ([#720](https://github.com/open-amt-cloud-toolkit/mps/issues/720)) (#6cab674) 
- **serviceVersion:** adds version api endpoint (#02d064f) 

### Fix
- **amt features:** corrected CIM_KVMRedirection enum comparison (#1b9c864) 
- **api:** remove hard limit of 25 from stats route (#a54e10e) 

### Refactor
- **mps:** made secret manager hot swappable ([#709](https://github.com/open-amt-cloud-toolkit/mps/issues/709)) (#bc74c2c) 

### Test
- enhance unit test coverage (#6d11f42) 


<a name="2.5.0"></a>

## [2.5.0] - 2022-10-05
### Build
- **deps:** bump pg from 8.7.3 to 8.8.0 (#1b2df8c) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#609cd0f) 
- **deps:** bump express-validator from 6.14.1 to 6.14.2 (#086b241) 
- **deps:** bump consul from 0.40.0 to 1.0.1 (#52f4620) 
- **deps:** bump ws from 8.8.0 to 8.8.1 (#aefda40) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#270b540) 
- **deps:** bump winston from 3.8.1 to 3.8.2 (#600bfbd) 
- **deps:** bump winston from 3.7.2 to 3.8.1 (#4e628d9) 
- **deps-dev:** bump typescript from 4.7.4 to 4.8.2 (#9628eed) 
- **deps-dev:** bump typescript from 4.8.2 to 4.8.3 (#3c45a32) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 1.0.2 to 1.0.4 (#c7f481b) 
- **deps-dev:** bump jest-junit from 14.0.0 to 14.0.1 (#b2d3526) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 1.0.4 to 1.0.5 (#6edd9c3) 
- **deps-dev:** bump [@types](https://github.com/types)/express from 4.17.13 to 4.17.14 (#6b15de8) 
- **deps-dev:** bump eslint-plugin-license-header from 0.4.0 to 0.6.0 (#6293f2e) 
- **deps-dev:** bump jest-junit from 13.2.0 to 14.0.0 (#871190a) 
- **deps-dev:** bump typescript from 4.7.3 to 4.7.4 (#77f588e) 
- **deps-dev:** bump ts-node from 10.8.1 to 10.9.1 (#4a12038) 

### Docs
- updates changelog to v2.5.0 (#c741676) 

### Feat
- adding AMT Alarm Clock APIs to MPS (#05be999) 

### Fix
- updated wsman-messages to 2.4.0 (#8213ecb) 
- log CIRA channel open failure at 'error' rather than 'silly' level (#0777d33) 
- powerAction and powerCapabilites now transpile without errors (#2ed5337) 
- **mps:** tls cipher selection ([#634](https://github.com/open-amt-cloud-toolkit/mps/issues/634)) (#54b0c5e) 


<a name="v2.4.0"></a>

## [v2.4.0] - 2022-07-07
### Build
- **deps:** bump ws from 8.7.0 to 8.8.0 (#dbc8f13) 
- **deps:** bump express-validator from 6.14.0 to 6.14.1 (#d3a78e3) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#49e90ee) 
- **deps:** bump ws from 8.6.0 to 8.7.0 (#a86b29d) 
- **deps:** bump got from 11.8.3 to 11.8.5 ([#618](https://github.com/open-amt-cloud-toolkit/mps/issues/618)) (#0ad4afc) 
- **deps:** bump [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#632f6e1) 
- **deps-dev:** bump typescript from 4.6.4 to 4.7.2 (#7bb7e65) 
- **deps-dev:** bump ts-node from 10.7.0 to 10.8.0 (#1d522d2) 
- **deps-dev:** bump ts-node from 10.8.0 to 10.8.1 (#67b549c) 
- **deps-dev:** bump typescript from 4.7.2 to 4.7.3 (#ea1c12b) 

### Chore
- update changelog for 2.4 and update package.json (#a894513) 

### Ci
- rename test file output (#cfc2143) 
- remove node 12 and add 18 for build (#fbb918c) 
- **codeql:** upgrade codeql to v2 (#56d18db) 
- **jest:** upload junit results as built artifact (#6c24f6a) 
- **lint:** enforce consistent copyright and license across all code files (#28e7b22) 
- **postman:** upload postman results as build artifact (#ab79fab) 

### Feat
- **api:** to get short lived bearer token for direction sessions ([#612](https://github.com/open-amt-cloud-toolkit/mps/issues/612)) (#32c5652) 
- **auth:** Added a User Auth configuration setting to disable/enable MPS auth (#897e9f2) 

### Fix
- **Security:** variable to set minimum TLS version ([#611](https://github.com/open-amt-cloud-toolkit/mps/issues/611)) (#4657e06) 

### Test
- **db:** refactor initialization for unit tests (#274b31e) 
- **postman:** automated mps (#cc63b5f) 


<a name="v2.3.2"></a>

## [v2.3.2] - 2022-06-15
### Fix
- **dependencies:** resolve peer dependencies for eslint (#abe8e9c) 


<a name="v2.3.1"></a>

## [v2.3.1] - 2022-05-11
### Fix
- **devices:** query parameters now work as expected (#150ac31) 


<a name="v2.3.0"></a>

## [v2.3.0] - 2022-05-11
### Build
- bump version to v2.3.0 (#0f8daab) 
- **dep:** adds support for wsman-messages 2.3.1 (#5a80dd8) 
- **deps:** bump winston from 3.7.1 to 3.7.2 (#f217c87) 
- **deps:** bump minimist from 1.2.5 to 1.2.6 (#9c17ab6) 
- **deps:** bump express from 4.17.3 to 4.18.0 (#52cfb30) 
- **deps:** bump winston from 3.6.0 to 3.7.1 (#ef43f4d) 
- **deps:** bump node-forge from 1.3.0 to 1.3.1 (#c117d26) 
- **deps:** bump ws from 8.5.0 to 8.6.0 (#d1c2c66) 
- **deps:** bump express from 4.18.0 to 4.18.1 (#7d79041) 
- **deps:** bump node-forge from 1.2.1 to 1.3.0 (#759acd0) 
- **deps-dev:** bump jest-junit from 13.0.0 to 13.1.0 (#511be1b) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 1.0.1 to 1.0.2 (#6289229) 
- **deps-dev:** bump jest-junit from 13.1.0 to 13.2.0 (#18aa98d) 
- **deps-dev:** bump typescript from 4.6.2 to 4.6.3 (#386f59d) 
- **deps-dev:** bump typescript from 4.6.3 to 4.6.4 (#7c5ac1a) 
- **deps-dev:** bump ts-jest from 27.1.3 to 27.1.4 (#9906ff6) 
- **deps-dev:** bump eslint-plugin-import from 2.25.4 to 2.26.0 (#1e74ca8) 

### Ci
- **lint:** adds semantic checks to PRs (#8433d8a) 

### Docs
- update changelog for v2.3.0 (#824a75b) 

### Feat
- **API:** Adds hostname query parameter to getDevices (#d67cc3d) 
- **redirection:** adds mqtt start and stop events for redirection ([#573](https://github.com/open-amt-cloud-toolkit/mps/issues/573)) (#e51906e) 
- **ws:** prevents multiple KVM/SOL session attempts ([#587](https://github.com/open-amt-cloud-toolkit/mps/issues/587)) (#8051abb) 

### Fix
- **dockerfile:** set user as non-root (#4808186) 
- **nonce:** set nonce to 8 character hexadecimal (#2135830) 

### Refactor
- **healthcheck:** improves testability and code coverage (#02ff45f) 
- **mps:** Input validation checks in APFProcessor for max size ([#597](https://github.com/open-amt-cloud-toolkit/mps/issues/597)) (#82e3efd) 


<a name="v2.2.0"></a>

## [v2.2.0] - 2022-03-18
### Build
- **deps:** bump node-forge from 0.10.0 to 1.0.0 (#6ad11a6) 
- **deps:** bump ws from 8.2.3 to 8.3.0 (#b88178e) 
- **deps:** bump express-validator from 6.13.0 to 6.14.0 (#0a085e1) 
- **deps:** add [@open](https://github.com/open)-amt-cloud-toolkit/wsman-messages (#bb3b188) 
- **deps:** bump express from 4.17.1 to 4.17.2 (#b98ccb6) 
- **deps:** bump ws from 8.3.0 to 8.4.0 (#8bcf05c) 
- **deps:** bump mqtt from 4.2.8 to 4.3.2 (#8c6bf9b) 
- **deps:** bump mqtt from 4.3.6 to 4.3.7 (#9d48189) 
- **deps:** fix wsman-messages version (#82910c5) 
- **deps:** bump mqtt from 4.3.2 to 4.3.3 (#c3063ac) 
- **deps:** bump winston from 3.5.1 to 3.6.0 (#a2056ef) 
- **deps:** bump mqtt from 4.3.5 to 4.3.6 (#f66689c) 
- **deps:** bump express from 4.17.2 to 4.17.3 (#16ebfd8) 
- **deps:** bump mqtt from 4.3.3 to 4.3.4 (#7a1b64e) 
- **deps:** bump node-forge from 1.0.0 to 1.1.0 (#4866fad) 
- **deps:** bump ws from 8.4.2 to 8.5.0 (#01bc4c1) 
- **deps:** bump winston from 3.3.3 to 3.4.0 (#422e884) 
- **deps:** bump node-forge from 1.1.0 to 1.2.1 (#a0aa110) 
- **deps:** bump pg from 8.7.1 to 8.7.3 (#70cf355) 
- **deps:** bump mqtt from 4.3.4 to 4.3.5 (#3d8e2e3) 
- **deps:** bump winston from 3.4.0 to 3.5.1 (#24a448f) 
- **deps:** bump ws from 8.4.0 to 8.4.2 (#5012728) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 27.4.0 to 27.4.1 (#363d89d) 
- **deps-dev:** bump typescript from 4.5.4 to 4.5.5 (#041d713) 
- **deps-dev:** bump jest from 27.4.7 to 27.5.0 (#4152613) 
- **deps-dev:** bump [@types](https://github.com/types)/pg from 8.6.3 to 8.6.4 (#9407e4d) 
- **deps-dev:** bump ts-node from 10.4.0 to 10.5.0 (#89c2f95) 
- **deps-dev:** bump jest from 27.5.0 to 27.5.1 (#0a1209e) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.10 to 1.0.0 (#ac5ec9d) 
- **deps-dev:** bump ts-jest from 27.1.2 to 27.1.3 (#fcc6a9b) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 8.2.2 to 8.2.3 (#4ec07a7) 
- **deps-dev:** bump jest from 27.4.5 to 27.4.7 (#f0c52d6) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 8.2.3 to 8.5.0 (#8f7f628) 
- **deps-dev:** bump eslint-plugin-import from 2.25.3 to 2.25.4 (#3476a30) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 27.0.3 to 27.4.0 (#ee58f41) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 8.5.0 to 8.5.2 (#1634545) 
- **deps-dev:** bump [@types](https://github.com/types)/pg from 8.6.2 to 8.6.3 (#1354029) 
- **deps-dev:** bump eslint-plugin-promise from 5.2.0 to 6.0.0 (#02316df) 
- **deps-dev:** bump [@types](https://github.com/types)/pg from 8.6.4 to 8.6.5 (#cb15272) 
- **deps-dev:** bump [@types](https://github.com/types)/pg from 8.6.1 to 8.6.2 (#3a3ed87) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 1.0.0 to 1.0.1 (#5b33ea8) 
- **deps-dev:** bump ts-jest from 27.1.1 to 27.1.2 (#83b371f) 
- **deps-dev:** bump typescript from 4.5.5 to 4.6.2 (#f14a218) 
- **deps-dev:** bump jest from 27.4.3 to 27.4.5 (#fcf31fb) 
- **deps-dev:** bump [@types](https://github.com/types)/body-parser from 1.19.1 to 1.19.2 (#fc0f10f) 
- **deps-dev:** bump typescript from 4.5.2 to 4.5.4 (#b07e27c) 
- **deps-dev:** bump ts-jest from 27.1.0 to 27.1.1 (#a7c00a9) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 8.2.1 to 8.2.2 (#be163d0) 
- **deps-dev:** bump ts-jest from 27.0.7 to 27.1.0 (#1ab2035) 
- **deps-dev:** bump eslint-plugin-promise from 5.1.1 to 5.2.0 (#9ae2365) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 8.2.0 to 8.2.1 (#8e46061) 
- **deps-dev:** bump ts-node from 10.5.0 to 10.7.0 (#1569f93) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.9 to 0.10.10 (#8abf35a) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 8.5.2 to 8.5.3 (#5438b2c) 
- **deps-dev:** bump typescript from 4.4.4 to 4.5.2 (#32acb5f) 
- **deps-dev:** bump eslint-plugin-import from 2.25.2 to 2.25.3 (#e78ac03) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 27.0.2 to 27.0.3 (#75c07a0) 
- **deps-dev:** bump jest from 27.3.1 to 27.4.3 (#18f5f33) 
- **node:** bump from 14.x to 16.x ([#435](https://github.com/open-amt-cloud-toolkit/mps/issues/435)) (#5da3c50) 

### Ci
- notify slack on scan failures (#5b25e4b) 
- only scan on main (#5db2b6c) 
- **jest:** fix test report failure ([#493](https://github.com/open-amt-cloud-toolkit/mps/issues/493)) (#e43974a) 
- **tests:** add test output (#fa8ba87) 
- **workflow:** optimize node CI (#a1d482f) 

### Docs
- update changelog for release (#997f184) 
- **swagger:** removes swagger from source control (#4d3833f) 

### Feat
- **healthcheck:** adds API endpoint for healthcheck (#5085569) 

### Fix
- CIRA race condition and add 30 sec keepalive time (#f84f6a2) 
- **api:** connection status query parameter now matches API docs for devices (#3091294) 
- **api:** removed common tag envelope from AMT responses ([#481](https://github.com/open-amt-cloud-toolkit/mps/issues/481)) (#eb8603f) 
- **api:** updated return value code with value type (#5124aa1) 
- **api:** reverts auditlog field names back to being capitalized (#ff15aa8) 
- **cira:** close cira channel after request (#6738d7b) 
- **cira:** clears the wsman response messages once parsed ([#468](https://github.com/open-amt-cloud-toolkit/mps/issues/468)) (#2187eeb) 
- **cira:** handle chunked http message (#2c44300) 
- **test:** added unit test for secret manager ([#436](https://github.com/open-amt-cloud-toolkit/mps/issues/436)) (#bed8025) 
- **test:** added unit test for db(pg) ([#430](https://github.com/open-amt-cloud-toolkit/mps/issues/430)) (#ecc42f7) 

### Refactor
- **amt:** limit connect retry attempts for invalid password (#36b7a5a) 
- **amt:** update hardwareinfo to more closesly align with v2.1 (#54cc303) 
- **amt_models:** matching case ([#453](https://github.com/open-amt-cloud-toolkit/mps/issues/453)) (#3071866) 
- **api:** updates audit log and adds unit tests for it to connected devices (#9adf30f) 
- **api:** get version uses new amt libraries ([#446](https://github.com/open-amt-cloud-toolkit/mps/issues/446)) (#977ba3d) 
- **api:** general settings uses new amt library ([#456](https://github.com/open-amt-cloud-toolkit/mps/issues/456)) (#722975c) 
- **api:** user consent ([#458](https://github.com/open-amt-cloud-toolkit/mps/issues/458)) (#04d9923) 
- **api:** updates audit log to leverage refactored device connection (#52044e7) 
- **api:** power actions leverage new connection libraries (#6806237) 
- **api:** get amt features was missing userConsent property (#c29cee4) 
- **api:** set amt features uses new CIRA connection (#7087eb3) 
- **api:** hardware information ([#460](https://github.com/open-amt-cloud-toolkit/mps/issues/460)) (#48f4576) 
- **api:** update getAMTFeatures to use new CIRA connections (#019895e) 
- **api:** updated event log ([#463](https://github.com/open-amt-cloud-toolkit/mps/issues/463)) (#2438bbd) 
- **cira:** fix cira channel distruption across multiple API Calls (#ef4fdb8) 
- **cira:** remove javascript libraries and leverage new refactored AMT libraries (#fa68566) 
- **logging:** centralizes logging and mqtt messages into messages.ts (#de32b04) 
- **logging:** fixes spelling mistakes (#d0f9a4b) 
- **mps:** remove node-vault (#9d4963e) 
- **power:** ensure AMT response aligns with v2.1 (#dc26d76) 
- **power:** use new device handling (#27c5c28) 
- **routes:** update power action to match v2.1 format (#39e5686) 
- **websockets:** KVM and SOL now use new CIRA connection (#e075539) 
- **wsman:** use new dependency wsman-message (#2f0c65c) 

### Test
- adds unit tests for APFProcessor (#937a495) 
- **auth:** Adding unit test to auth folder (#91a698d) 
- **cert:** Adding unit test to cert folder (#b930841) 
- **cira:** added unit test for CIRAHandler (#69f1263) 
- **config:** consider all files for test coverage (#1f296df) 
- **coverage:** remove test directory from coverage (#7aed306) 
- **devices:** adds tests for devices route (#63ce782) 
- **devices:** Add unit test to index (#811d8bd) 
- **factories:** Adding unit test to factories (#22aee9a) 
- **health:** Adding unit test to health folder (#8ba9e1e) 
- **health:** moves and renames healthcheck.spec.ts to get.test.ts (#89a67d1) 
- **mpsserver:** increase code coverage for MPS (#e9c2453) 
- **refactor:** reorganize test file locations (#e914b57) 
- **routes:** Adding unit test to index (#ab4c866) 
- **utils:** adds tests for tlsConfiguration (#ca44878) 
- **utils:** adds tests for certificates (#7524e54) 
- **utils:** Adding parseEnvValue unit test (#2eda6a7) 


<a name="v2.1.0"></a>

## [v2.1.0] - 2021-11-08
### Build
- **dep:** update jest to 27.2.1 (#491c247) 
- **deps:** bump express-validator from 6.12.2 to 6.13.0 (#8bab749) 
- **deps:** bump validator from 13.6.0 to 13.7.0 (#8370149) 
- **deps:** bump ansi-regex from 5.0.0 to 5.0.1 (#ed63d57) 
- **deps:** bump express-validator from 6.12.1 to 6.12.2 (#d00f363) 
- **deps:** bump ws from 8.2.2 to 8.2.3 (#6a48713) 
- **deps:** bump tmpl from 1.0.4 to 1.0.5 (#6818e24) 
- **deps-dev:** bump jest from 27.2.4 to 27.2.5 (#92d27aa) 
- **deps-dev:** bump typescript from 4.4.3 to 4.4.4 (#0a865a2) 
- **deps-dev:** bump ts-jest from 27.0.5 to 27.0.6 (#7a85af2) 
- **deps-dev:** bump eslint-plugin-import from 2.24.2 to 2.25.2 (#c2bb948) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.7 to 0.10.8 (#5f4db8b) 
- **deps-dev:** bump ts-node from 10.2.1 to 10.3.0 (#cd431c3) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.5 to 0.10.7 (#1ad32c4) 
- **deps-dev:** bump jest from 27.2.5 to 27.3.1 (#16eceed) 
- **deps-dev:** bump ts-jest from 27.0.6 to 27.0.7 (#82a4432) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#b696a6e) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.32.0 to 4.33.0 (#6acbbdd) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#d2e1130) 
- **deps-dev:** bump jest from 27.2.1 to 27.2.4 (#312a3c8) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 7.4.7 to 8.2.0 (#9e6f0bd) 
- **deps-dev:** bump eslint-plugin-promise from 5.1.0 to 5.1.1 (#f73a729) 
- **deps-dev:** bump typescript from 4.4.2 to 4.4.3 (#9d2d7d7) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 27.0.1 to 27.0.2 (#3b49f38) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.31.0 to 4.32.0 (#c284401) 
- **deps-dev:** bump ts-node from 10.3.0 to 10.4.0 (#7fb4685) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.4 to 0.10.5 (#7f1f391) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.8 to 0.10.9 (#d5858d4) 
- **version:** bump to v2.1.0 (#7d7ebb3) 

### Ci
- rename master to main for jobs (#9bfebe5) 
- update docker-compose startup order (#0cafff7) 
- **changelog:** update changelog for publish option (#85865ba) 
- **docker:** fix manual build workflow (#17fa03a) 

### Docs
- adds issue template (#2373ba3) 
- add contributing guidelines (#c0673e9) 
- **changelog:** update changelog (#220587c) 
- **github:** add pull request template (#01051ae) 

### Feat
- **telemetry:** add events for CIRA Disconnect/Connection (#1cde473) 

### Fix
- empty event log now returns empty array instead of null (#0c6dfc0) 
- **api:** updated version api test uri (#054762d) 
- **certs:** exit process if vault  unavailable or error occurs on startup (#7df7a00) 
- **certs:** now self-signed certs are stored in vault (#b2d61a4) 
- **login:** username check should be case insensitive (#5767483) 
- **test:** handled rejections (#f567a85) 

### Refactor
- **config:** remove https from options (#564e147) 


<a name="v2.0.1"></a>

## [v2.0.1] - 2021-09-22
### Build
- **deps:** bump tmpl from 1.0.4 to 1.0.5 (#323fa74) 
- **version:** bump mps to v2.0.1 (#bdf9e5a) 

### Docs
- **changelog:** update changelog (#872cf68) 


<a name="v2.0.0"></a>

## [v2.0.0] - 2021-09-15
### Build
- update version to v2.0.0 (#d49ef8c) 
- **deps:** bump ws from 8.2.1 to 8.2.2 (#41e35b5) 
- **deps:** bump ws from 7.5.3 to 8.2.1 ([#359](https://github.com/open-amt-cloud-toolkit/mps/issues/359)) (#47b2901) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#33d16a2) 
- **deps-dev:** bump eslint-config-standard-with-typescript (#e3e17b1) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.3 to 0.10.4 (#8c1edef) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.29.3 to 4.31.0 (#34ac4be) 
- **deps-dev:** bump typescript from 4.3.5 to 4.4.2 (#4ead017) 
- **deps-dev:** bump eslint-plugin-import from 2.24.1 to 2.24.2 (#fc0e01c) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#58bbdee) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.24 to 27.0.1 (#3ad39e3) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.29.2 to 4.29.3 (#1dba02f) 
- **deps-dev:** bump ts-node from 10.2.0 to 10.2.1 (#7807a1d) 
- **deps-dev:** bump eslint-plugin-import from 2.24.0 to 2.24.1 (#f2eb912) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.29.1 to 4.29.2 (#e7151c0) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.2 to 0.10.3 (#5ddabda) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#6434938) 
- **deps-dev:** bump eslint-plugin-import from 2.23.4 to 2.24.0 (#93d277e) 

### Docs
- **changelog:** update changelog (#10382bf) 

### Feat
- **api:** added api for request, cancel and send user consent code to AMT ([#332](https://github.com/open-amt-cloud-toolkit/mps/issues/332)) (#e4fbe58) 
- **multitenancy:** add multi tenancy support (#4e323c8) 

### Fix
- **api:** cert now pulls from config instead of disk (#d9e04e3) 
- **docs:** updated swagger documentation (#7aee48a) 

### Refactor
- reduce copy and paste code via middleware (#078bc9e) 
- remove classes with only static functions (#f23099d) 
- **amt-stack:** updating amt libraries (#3ee5d53) 
- **amt_libraries:** squash commits (#b31e968) 
- **db:** align architecture to RPS for DB implementation (#d52142d) 
- **middleware:** add validation middleware to device routes (#f313521) 
- **sslpostgres:** removed username, password and enabled ssl (#649e81d) 
- **wsman:** fixed tests (#56212b0) 


<a name="v1.5.0"></a>

## [v1.5.0] - 2021-08-12
### Build
- fix tsconfig.json (#f11a145) 
- **deps:** bump express-validator from 6.12.0 to 6.12.1 (#1284dda) 
- **deps:** bump mqtt from 4.2.6 to 4.2.8 (#256ecd1) 
- **deps:** bump path-parse from 1.0.6 to 1.0.7 ([#323](https://github.com/open-amt-cloud-toolkit/mps/issues/323)) (#81d7aa1) 
- **deps:** bump node-vault from 0.9.21 to 0.9.22 (#589af0e) 
- **deps:** bump ws from 7.5.0 to 7.5.1 (#bccebe6) 
- **deps:** bump pg from 8.6.0 to 8.7.1 (#bd3c535) 
- **deps:** bump ws from 7.5.1 to 7.5.2 ([#275](https://github.com/open-amt-cloud-toolkit/mps/issues/275)) (#cff244f) 
- **deps:** bump ws from 7.5.2 to 7.5.3 (#a8ef7c0) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.17.3 to 14.17.4 (#8898712) 
- **deps-dev:** bump ts-node from 10.0.0 to 10.1.0 (#f4c5541) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 7.4.6 to 7.4.7 (#aa6f1d5) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.4 to 4.28.5 (#c721426) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.2 to 4.28.4 (#6c18c57) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.10.0 to 0.10.2 (#98d448e) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#4fc79a4) 
- **deps-dev:** bump [@types](https://github.com/types)/pg from 8.6.0 to 8.6.1 ([#282](https://github.com/open-amt-cloud-toolkit/mps/issues/282)) (#7d78625) 
- **deps-dev:** bump eslint from 7.30.0 to 7.31.0 (#8b79d85) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.23 to 26.0.24 ([#281](https://github.com/open-amt-cloud-toolkit/mps/issues/281)) (#56b5ce7) 
- **deps-dev:** bump [@types](https://github.com/types)/express from 4.17.12 to 4.17.13 (#81b3d2e) 
- **deps-dev:** bump typescript from 4.3.4 to 4.3.5 ([#272](https://github.com/open-amt-cloud-toolkit/mps/issues/272)) (#05bdbd8) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 7.4.5 to 7.4.6 ([#273](https://github.com/open-amt-cloud-toolkit/mps/issues/273)) (#8a345ce) 
- **deps-dev:** bump [@types](https://github.com/types)/body-parser from 1.19.0 to 1.19.1 ([#279](https://github.com/open-amt-cloud-toolkit/mps/issues/279)) (#8402b1c) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.1 to 4.28.2 ([#274](https://github.com/open-amt-cloud-toolkit/mps/issues/274)) (#fc444f9) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#6a7522a) 
- **deps-dev:** bump eslint from 7.29.0 to 7.30.0 ([#277](https://github.com/open-amt-cloud-toolkit/mps/issues/277)) (#444cb97) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#587cf55) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.0 to 4.28.1 (#b4811ff) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.28.5 to 4.29.1 ([#322](https://github.com/open-amt-cloud-toolkit/mps/issues/322)) (#6b823b8) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#2eca68e) 
- **deps-dev:** bump ts-node from 10.1.0 to 10.2.0 ([#320](https://github.com/open-amt-cloud-toolkit/mps/issues/320)) (#a24887b) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.27.0 to 4.28.0 (#8be94b9) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#60eaf09) 
- **deps-dev:** bump eslint from 7.28.0 to 7.29.0 (#1de15ee) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#321](https://github.com/open-amt-cloud-toolkit/mps/issues/321)) (#477c9cc) 
- **deps-dev:** bump eslint from 7.31.0 to 7.32.0 ([#316](https://github.com/open-amt-cloud-toolkit/mps/issues/316)) (#a381816) 
- **version:** bump to v1.5.0 ([#329](https://github.com/open-amt-cloud-toolkit/mps/issues/329)) (#50565ae) 

### Docs
- update copyright label (#b28820c) 
- update copyright header (#8c83e58) 
- **power actions:** added boot options api BREAKING CHANGE: added bootoptions api for power actions 100+ Fixes AB[#2777](https://github.com/open-amt-cloud-toolkit/mps/issues/2777) (#a58d939) 
- **security:** added SECURITY.md file (#b94487c) 
- **security:** added security.md file (#1dc6f5f) 

### Feat
- **api:** add pagination following odata spec (#69a2921) 

### Fix
- **api:** devices can be filtered by tags (#dea4180) 
- **audit-log:** not find secret for device ([#313](https://github.com/open-amt-cloud-toolkit/mps/issues/313)) (#1574846) 
- **disconnect:** compose now works with db update on exit ([#312](https://github.com/open-amt-cloud-toolkit/mps/issues/312)) (#3ef41a6) 
- **docs:** updated swagger doc with latest api changes ([#307](https://github.com/open-amt-cloud-toolkit/mps/issues/307)) (#e4cb139) 
- **startup:** mps now starts with tls_offload set to true (#bdab681) 

### Refactor
- **interfaces:** remove unused IAdminHandler and IAMTHandler (#2131d83) 
- **interfaces:** clearer separation of concerns is now reflected in interfaces (#3a2c48e) 
- **logging:** pr changes (#8e74786) 
- **logging:** removed key logging (#16657aa) 
- **logging:** updated log messages (#597b0e0) 
- **logging:** removed excessive logging variables ([#263](https://github.com/open-amt-cloud-toolkit/mps/issues/263)) (#2bfc936) 
- **mqtt:** cleaner event publishing using static functions (#d964c46) 
- **power actions:** split out power actions 100+ into bootoptions BREAKING CHANGE: added bootoptions api for power actions 100+ fixes AB[#2751](https://github.com/open-amt-cloud-toolkit/mps/issues/2751) (#0b9e650) 
- **types:** add better typing (#47cba4c) 
- **utils:** convert interceptor to ts (#bdbbca8) 

### Test
- **power actions:** added boot options test fixes AB[#2905](https://github.com/open-amt-cloud-toolkit/mps/issues/2905) (#415b09e) 


<a name="v1.4.0"></a>

## [v1.4.0] - 2021-06-23
### Build
- add snyk config (#3f447ab) 
- **dep:** missing atob dependency in package.json (#81da6b6) 
- **deps:** bump express-validator from 6.10.1 to 6.11.1 (#15dcd9a) 
- **deps:** bump ws from 7.4.5 to 7.4.6 (#2482bd0) 
- **deps:** add mqtt (#199f661) 
- **deps:** bump ws from 7.4.6 to 7.5.0 ([#247](https://github.com/open-amt-cloud-toolkit/mps/issues/247)) (#4b19dc4) 
- **deps:** bump express-validator from 6.11.1 to 6.12.0 ([#243](https://github.com/open-amt-cloud-toolkit/mps/issues/243)) (#199726b) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#b266831) 
- **deps-dev:** bump eslint from 7.27.0 to 7.28.0 ([#229](https://github.com/open-amt-cloud-toolkit/mps/issues/229)) (#b57c0ca) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#233](https://github.com/open-amt-cloud-toolkit/mps/issues/233)) (#669cbc7) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.9.9 to 0.10.0 ([#235](https://github.com/open-amt-cloud-toolkit/mps/issues/235)) (#4b9998a) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.26.0 to 4.26.1 ([#234](https://github.com/open-amt-cloud-toolkit/mps/issues/234)) (#2fb0719) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.17.2 to 14.17.3 ([#236](https://github.com/open-amt-cloud-toolkit/mps/issues/236)) (#09ff6e7) 
- **deps-dev:** bump typescript from 4.2.4 to 4.3.2 (#d860f67) 
- **deps-dev:** bump ts-node from 9.1.1 to 10.0.0 (#650b6fa) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.26.1 to 4.27.0 ([#245](https://github.com/open-amt-cloud-toolkit/mps/issues/245)) (#b68c5f7) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.17.1 to 14.17.2 (#70ee532) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.25.0 to 4.26.0 (#7a3cb15) 
- **deps-dev:** bump eslint-plugin-import from 2.23.3 to 2.23.4 (#c84d338) 
- **deps-dev:** bump eslint-config-standard from 16.0.2 to 16.0.3 (#a9d2946) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#244](https://github.com/open-amt-cloud-toolkit/mps/issues/244)) (#1796436) 
- **deps-dev:** bump [@types](https://github.com/types)/ws from 7.4.4 to 7.4.5 ([#249](https://github.com/open-amt-cloud-toolkit/mps/issues/249)) (#ebd26a2) 
- **deps-dev:** bump typescript from 4.3.2 to 4.3.4 ([#248](https://github.com/open-amt-cloud-toolkit/mps/issues/248)) (#336f16d) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.17.0 to 14.17.1 (#5a98d1f) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.24.0 to 4.25.0 (#78882ef) 
- **deps-dev:** bump [@types](https://github.com/types)/pg from 7.14.11 to 8.6.0 (#0482745) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.9.7 to 0.9.9 (#af994d9) 
- **deps-dev:** bump eslint-plugin-import from 2.23.2 to 2.23.3 (#8ec9c95) 
- **deps-dev:** bump eslint from 7.26.0 to 7.27.0 (#af6df2a) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.23.0 to 4.24.0 ([#200](https://github.com/open-amt-cloud-toolkit/mps/issues/200)) (#7651d78) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin ([#201](https://github.com/open-amt-cloud-toolkit/mps/issues/201)) (#b4a8f46) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.45 to 14.17.0 (#cc67b85) 
- **deps-dev:** bump eslint-plugin-import from 2.22.1 to 2.23.2 (#7fd8ea4) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.22.0 to 4.23.0 (#919694c) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.44 to 14.14.45 (#eaf0c69) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#43acf23) 
- **deps-dev:** bump ts-jest from 26.5.5 to 26.5.6 (#bf97627) 
- **deps-dev:** bump eslint from 7.25.0 to 7.26.0 (#9fa450d) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.43 to 14.14.44 (#1ccf3aa) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#981a78f) 
- **version:** bump to v1.4.0 (#df4a288) 

### Ci
- add codeQL scan (#0b7b5e6) 
- **changelog:** add automation for changelog (#6f4631e) 

### Docs
- **api:** remove metadata (#c7dd222) 
- **api:** additional edits (#eb353c7) 
- **api:** remove metadata (#8f5da14) 
- **api:** typo fix (#821b391) 
- **changelog:** update for v1.4.0 (#e7da297) 
- **package.json:** additional information (#9def359) 
- **readme:** update to v1.4.0 ([#251](https://github.com/open-amt-cloud-toolkit/mps/issues/251)) (#614d1da) 
- **swagger:** updated swagger docs for 1.3 (#f3c4617) 

### Feat
- **mqtt:** adds event logging to mps (#6338dd7) 
- **reverseproxy:** updated DB amd api's to store the connection status ([#189](https://github.com/open-amt-cloud-toolkit/mps/issues/189)) (#b3793c5) 
- **security:** add JWT verification to websocket connection (#02b5cf6) 

### Fix
- **api:** only update the columns requested for change ([#257](https://github.com/open-amt-cloud-toolkit/mps/issues/257)) (#6451a88) 
- **config:** removed use_allowlist from config ([#231](https://github.com/open-amt-cloud-toolkit/mps/issues/231)) (#0deb603) 
- **dockerfile:** send signals to node instead of npm (#981443c) 
- **scaling:** Revert scaling changes ([#198](https://github.com/open-amt-cloud-toolkit/mps/issues/198)) (#acaf5dc) 

### Refactor
- **auto:** check for jwt secret and mps credentials ([#238](https://github.com/open-amt-cloud-toolkit/mps/issues/238)) (#74ad9fc) 

### Test
- **auth:** test device auth ([#246](https://github.com/open-amt-cloud-toolkit/mps/issues/246)) (#a1c1902) 

### BREAKING CHANGE

JWT is now required for KVM/SOL connections


<a name="v1.3.0"></a>

## [v1.3.0] - 2021-05-06
### Build
- bump package.json version to 1.3.0 (#c250cf5) 
- **deps:** bump express-validator from 6.10.0 to 6.10.1 (#33d880f) 
- **deps:** bump redis from 3.0.2 to 3.1.0 (#4dcf470) 
- **deps:** bump pg from 8.5.1 to 8.6.0 (#2f1c0b9) 
- **deps:** bump ws from 7.4.4 to 7.4.5 (#a86a385) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.37 to 14.14.39 (#19b86da) 
- **deps-dev:** bump eslint from 7.24.0 to 7.25.0 (#4e09c0e) 
- **deps-dev:** bump ts-jest from 26.5.4 to 26.5.5 (#c1c6b8e) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.39 to 14.14.41 (#fefce40) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.22 to 26.0.23 (#1f1c274) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.41 to 14.14.43 (#25d989e) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#4b33a37) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.21.0 to 4.22.0 (#a1ff9a4) 
- **deps-dev:** bump eslint from 7.23.0 to 7.24.0 (#639f1cb) 
- **deps-dev:** bump eslint-plugin-promise from 4.3.1 to 5.1.0 (#1c597ed) 
- **deps-dev:** bump typescript from 4.2.3 to 4.2.4 (#837eadd) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#cd9c4d7) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.20.0 to 4.21.0 (#04f5daa) 
- **dockerfile:** add license label (#49bfeac) 

### Ci
- add test coverage requirement (#1be7d88) 
- add test coverage requirement (#53590c3) 

### Docs
- add changelog (#59eb64a) 
- **api:** pr updates (#e9d3795) 
- **api:** corrected case (#bfe719c) 
- **api:** updated device and status query (#f3cd1e4) 
- **api:** update swagger definition (#8a8e864) 
- **changelog:** add v1.3.0 (#616eeaa) 
- **swagger:** add login API info (#26adddc) 

### Feat
- **api:** added device get ([#167](https://github.com/open-amt-cloud-toolkit/mps/issues/167)) (#4b10b8d) 

### Fix
- **api:** fix for jwt token expiration time (#696c5e0) 
- **metadata:** update SQL column name to hostname (#8153af8) 

### Refactor
- **api:** PR162 updates (#4969854) 
- **api:** align mps and rps api architecture (#20ffdf4) 
- **config:** default JWT expiration to 24 hours (#d844e82) 
- **proxy:** remove tls from app (#9ca8e55) 

### Test
- **api:** move host port to postman env (#cfefbd2) 
- **api:** update API tests (#8759565) 

### BREAKING CHANGE

amt and admin routes have been renamed/changed. Payload property removed from post body.

Auth is now stateless, db and vault required


<a name="v1.2.0"></a>

## [v1.2.0] - 2021-04-02
### Build
- **dep:** force lodash to latest (#3d0f781) 
- **deps:** bump ws from 7.4.2 to 7.4.3 (#a52aea6) 
- **deps:** bump ws from 7.4.3 to 7.4.4 (#697027f) 
- **deps:** add express-validator (#021b937) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.35 to 14.14.36 (#65b19b3) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.36 to 14.14.37 (#8c68dfc) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.21 to 26.0.22 (#89c1af6) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.18.0 to 4.19.0 (#b3c2fb1) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#1cab8c7) 
- **deps-dev:** bump [@types](https://github.com/types)/jest from 26.0.20 to 26.0.21 (#be759aa) 
- **deps-dev:** bump ts-jest from 26.5.3 to 26.5.4 (#346dd80) 
- **deps-dev:** bump eslint from 7.22.0 to 7.23.0 (#aa169e9) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.17.0 to 4.18.0 (#14819f7) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.34 to 14.14.35 (#635ed67) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#bfd6e46) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.33 to 14.14.34 (#66b1bf6) 
- **deps-dev:** bump eslint from 7.21.0 to 7.22.0 (#4d326d1) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.32 to 14.14.33 (#d8c318e) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#1f37299) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.16.1 to 4.17.0 (#a0f54d8) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.31 to 14.14.32 (#905f11c) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.19.0 to 4.20.0 (#c3b81b9) 
- **deps-dev:** bump ts-jest from 26.5.2 to 26.5.3 (#8987b18) 
- **deps-dev:** bump [@types](https://github.com/types)/pg from 7.14.10 to 7.14.11 (#32e548d) 
- **deps-dev:** bump typescript from 4.2.2 to 4.2.3 (#e1e7b67) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#7a85796) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.15.2 to 4.16.1 (#eecc5bb) 
- **deps-dev:** bump eslint from 7.20.0 to 7.21.0 (#9f856f7) 
- **deps-dev:** bump ts-jest from 26.5.1 to 26.5.2 (#16dda90) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#2b0e643) 
- **deps-dev:** bump typescript from 4.1.5 to 4.2.2 (#5a3c24d) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.15.1 to 4.15.2 (#3954af7) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.28 to 14.14.31 (#9e1d5f2) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.15.0 to 4.15.1 (#796519a) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.22 to 14.14.27 (#6da4a0f) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.27 to 14.14.28 (#7378893) 
- **deps-dev:** bump typescript from 3.9.7 to 4.1.5 (#17f084b) 
- **deps-dev:** bump eslint-plugin-promise from 4.2.1 to 4.3.1 (#128369c) 
- **deps-dev:** bump ts-jest from 26.5.0 to 26.5.1 (#0af6d8d) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#7d6ab8b) 
- **deps-dev:** bump eslint from 7.19.0 to 7.20.0 (#3efee23) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#bb91e8b) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.14.2 to 4.15.0 (#6d54246) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#fbec7fb) 
- **docker:** update node image to 14-buster-slim (#173517e) 

### Ci
- add initial jenkinsfile (#60cd7fc) 
- enforce lint on PR merge ([#99](https://github.com/open-amt-cloud-toolkit/mps/issues/99)) (#37edae1) 

### Docs
- **api:** update swagger to include tags (#43ce5cd) 
- **api:** add swagger definition (#b1d7159) 
- **api:** add swagger documentation (#d7629c4) 

### Feat
- **api:** add endpoint /stats (#5eea84a) 
- **metadata:** add postgress db for storing device metadata ([#108](https://github.com/open-amt-cloud-toolkit/mps/issues/108)) (#43068ec) 
- **scaling:** add scaling support for mps ([#139](https://github.com/open-amt-cloud-toolkit/mps/issues/139)) (#60213fe) 
- **tags:** add query filter for tags on device metadata (#221076e) 

### Fix
- wrong return type (#4197a9b) 
- **cira:** removed log statements; corrected case ([#146](https://github.com/open-amt-cloud-toolkit/mps/issues/146)) (#8a1ed67) 
- **stats:** ensure disconnected count is non-negative (#aacc1ee) 
- **webserver:** request query params type check (#c99c0a5) 

### Refactor
- added missing let in for loops (#4c1da76) 
- **lint:** apply new-cap rule ([#92](https://github.com/open-amt-cloud-toolkit/mps/issues/92)) (#7d22e1f) 
- **lint:** apply new-cap, no-unused-var, naming-convention rule (#e61a282) 
- **lint:**  apply eqeqeq rule (#77ee5b9) 
- **lint:** apply restrict-plus-operator (#455e93e) 
- **lint:** no-var-requires ([#93](https://github.com/open-amt-cloud-toolkit/mps/issues/93)) (#caad1a8) 
- **lint:** apply no-path-concat rule ([#91](https://github.com/open-amt-cloud-toolkit/mps/issues/91)) (#29603b2) 
- **lint:** apply [@typescript](https://github.com/typescript)-eslint/explicit-function-return-type rule (#25bc848) 
- **lint:** autofix formatting (#80efa36) 
- **metadata:** rename device db references to metadata (#a0e838e) 

### Test
- **api:** add basic api tests (#b8fa55f) 


<a name="v1.1.0"></a>

## [v1.1.0] - 2021-02-11
### Build
- **deps:** update jest to 26.6.0 (#2760ece) 
- **deps-dev:** bump eslint from 7.17.0 to 7.19.0 (#977da00) 
- **deps-dev:** bump ts-node from 8.10.2 to 9.1.1 (#6988d02) 
- **deps-dev:** bump [@types](https://github.com/types)/node-forge from 0.8.7 to 0.9.7 (#835dc35) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/parser from 4.12.0 to 4.14.2 (#b4502a7) 
- **deps-dev:** bump [@types](https://github.com/types)/node from 14.14.20 to 14.14.22 (#a1262b4) 
- **deps-dev:** bump [@typescript](https://github.com/typescript)-eslint/eslint-plugin (#5d23a18) 
- **deps-dev:** bump ts-jest from 26.4.4 to 26.5.0 (#6b450f1) 
- **deps-dev:** bump eslint-config-standard-with-typescript (#c7fbe67) 

### Ci
- add latest tag to docker image (#20d1576) 
- add dependabot config (#45d43ae) 
- add types for conventional commits (#bf8dbdf) 
- add docker ci (#e414058) 
- update docker build (#55b5526) 
- Update docker-image.yml (#530ea4e) 
- remove snyk from github actions (#72353cc) 
- **docs:** remove automation (#32a4f23) 

### Docs
- add changelog (#434495a) 
- add status badges (#f66ce3d) 
- add release disclaimer (#b3ff61d) 
- remove from mps and move to docs repo (#83225e2) 

### Feat
- **cors:** Add support for CORS (#f39cb40) 

### Fix
- cors support for cookies (#13a22ce) 
- upgrade node-vault from 0.9.20 to 0.9.21 (#c984151) 
- upgrade ws from 7.3.1 to 7.4.0 (#64990da) 
- **CORS:** added support to multiple origins (#0686cfc) 
- **api:** changed response for logout api (#d2ab694) 
- **cors:** allow setting of cors regardless of authmode (#0cfb4de) 

### Refactor
- default allowlist to false in config (#cadc8f4) 
- remove webui pieces (#22f609d) 
- migrate from internal (#92ed29f) 
- **docker:** migrate docker scripts to open-amt-cloud-toolkit (#d340dcc) 
- **eslint:** add linting to code (#4b45c8e) 
- **webui:** move webui (#23fd82f) 


<a name="v1.0.0"></a>

## v1.0.0 - 2020-11-20
### Build
- add condition for master to publish docs (#71d6eca) 
- optimize dockerfile (#675caab) 

### Ci
- license and copyright added (#2920854) 
- add build automation w/ github actions (#f642959) 
- build automation for documentation (#a68afc7) 

### Docs
- format vault document (#0144655) 
- update docker to reflect vault in dev mode (#f63f3ae) 
- remove prev/next guidance (#07dde39) 
- fix broken link in localization.md (#79e53cb) 
- fix broken link (#78a1dfa) 
- link fix (#9b6e093) 

### Fix
- **docker:** build time taking too long (#8b63eb8) 

### Refactor
- **docker:** remove build pre-build step (#14a7848) 
- **docker:** optimize dockerfile (#51cfb0e) 
