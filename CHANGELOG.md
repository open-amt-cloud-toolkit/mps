<a name="unreleased"></a>
## [Unreleased]


<a name="2.0.1"></a>
## [2.0.1] - 2021-09-22
### Build
- **deps:** bump tmpl from 1.0.4 to 1.0.5 (#323fa74) 
- **version:** bump mps to v2.0.1 (#bdf9e5a) 


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


[Unreleased]: https://github.com/open-amt-cloud-toolkit/mps/compare/2.0.1...HEAD
[2.0.1]: https://github.com/open-amt-cloud-toolkit/mps/compare/v2.0.0...2.0.1
[v2.0.0]: https://github.com/open-amt-cloud-toolkit/mps/compare/v1.5.0...v2.0.0
[v1.5.0]: https://github.com/open-amt-cloud-toolkit/mps/compare/v1.4.0...v1.5.0
[v1.4.0]: https://github.com/open-amt-cloud-toolkit/mps/compare/v1.3.0...v1.4.0
[v1.3.0]: https://github.com/open-amt-cloud-toolkit/mps/compare/v1.2.0...v1.3.0
[v1.2.0]: https://github.com/open-amt-cloud-toolkit/mps/compare/v1.1.0...v1.2.0
[v1.1.0]: https://github.com/open-amt-cloud-toolkit/mps/compare/v1.0.0...v1.1.0
