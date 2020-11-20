## Add/Modify guids.json

If `use_allowlist` is set to `true` in the `config.json` file, add a `guids.json` file in the *private* directory to allowlist those Intel&reg; AMT GUIDs that are allowed to connect to MPS. 

Use **guids.json.example** as a reference to create the guids.json and populate it with guids to allowlist. This file is used to simulate allowlisting based on Intel&reg; AMT GUIDs.

For information on how to obtain GUIDs, see [GUIDs in Intel&reg; AMT](#guids-in-intel-amt).

1. Navigate to the ~/MPS/private directory.

``` sh
cd ~/MPS/private
```

2. Create the `guids.json` file.

``` sh
copy guids.json.example guids.json
```

3. Open the `guids.json` file. Edit this file to include the GUIDs of your AMT devices. You can find specific GUIDs using [MeshCmd](#guids-in-intel-amt) on the AMT device.

Example `guids.json` file:

``` json
["8dad96cb-c3db-11e6-9c43-bc0000d20000","12345678-9abc-def1-2345-123456789000"]
```