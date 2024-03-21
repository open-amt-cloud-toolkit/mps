```
npx rollup -c
node -e "require('fs').copyFileSync(process.execPath, 'mps.exe')"
node --experimental-sea-config mps-exec-config.json
signtool remove /s mps.exe
npx postject mps.exe NODE_SEA_BLOB mps-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --overwrite
```