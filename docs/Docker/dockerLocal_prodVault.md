# Run MPS and RPS using docker and production vault
## Introduction
This document describes how to run MPS and RPS using vault in production server mode. The current local docker-compose file runs vault in development mode which makes experimenting with the services easier since static tokens can be used for access and unsealing vault is not required. The downside to this approach is all vault data is stored only in memory which is lost once the vault container is stopped. Running vault in production mode requires more steps but allows vault data to persist after container restarts.


1\. Update the vault section in the docker-compose file (scripts\docker-compose\docker-compose.yaml) with the section below: 

```
 vault:
    image: vault
    container_name: prodvault
    environment:
      VAULT_ADDR: http://127.0.0.1:8200
    ports:
      - "8200:8200"
    volumes:
      - private-volume:/vault/file:rw
      - ./vault:/vault/config:rw
    cap_add:
      - IPC_LOCK
    entrypoint: vault server -config=/vault/config/vault.json

```

2\. Create a folder named 'vault' located in scripts\docker-compose\ and add a file named vault.json with the contents below:
```
{
   "backend":{
      "file":{
         "path":"/vault/file"
      }
   },
   "listener":{
      "tcp":{
         "address":"0.0.0.0:8200",
         "tls_disable":1
      }
   },
   "default_lease_ttl":"168h",
   "max_lease_ttl":"0h",
   "ui":true,
   "log_level":"Debug"
}
```

3\. Run docker command to start the stack:
```
docker-compose up
```

4\. Run the following command to initialize the vault instance.

```
docker exec -it prodvault vault operator init -n 1 -t 1
```

Make note of unseal key 1 and initial root token. 

ex.
```
Unseal Key 1: 0H8sK2QvVsqBKnUz6okBtDOqTVFSgJpdSKVe+colgXM=
Initial Root Token: s.1glIfXnANPSnEmKLCzk4PQCO
```

5\. Run the unseal command to decrypt the contents of the vault. Note: this step has to be performed each time the vault container is restarted.
```
docker exec -it prodvault vault operator unseal [unseal key 1]

ex.
docker exec -it prodvault vault operator unseal 0H8sK2QvVsqBKnUz6okBtDOqTVFSgJpdSKVe+colgXM=
```
    
The response to the command should look similar to this:

```    
    Key             Value
---             -----
Seal Type       shamir
Initialized     true
Sealed          false
Total Shares    1
Threshold       1
Version         1.6.0
Storage Type    file
Cluster Name    vault-cluster-a39d7ef8
Cluster ID      d1bc85f9-f405-44b3-0553-50f5e10b140e
HA Enabled      false
```
   
6\. Login to vault with the following command using the initial root token:   

```
docker exec -it prodvault vault login [Initial Root Token]

ex.
docker exec -it prodvault vault login s.1glIfXnANPSnEmKLCzk4PQCO
```
    
7\. Enable the kv secrets engine   
```
docker exec -it prodvault vault secrets enable -version=2 kv
```
    
 8\. Update env variables located in scripts\docker-compose\.env
 a) Update vault tokens used in each service

 ```
 RPS_VAULT_TOKEN=[initial root token]
 MPS_VAULT_TOKEN=[initial root token]
 
 ex.
 RPS_VAULT_TOKEN=s.1glIfXnANPSnEmKLCzk4PQCO
 MPS_VAULT_TOKEN=s.1glIfXnANPSnEmKLCzk4PQCO
 ```

 b) update secretes path
```
MPS_SECRETS_PATH=kv/data/
RPS_SECRETS_PATH=kv/data/
``` 

9\. Press ctrl-c to stop the stack
10\. Restart the stack using the command `docker-compose up`.
11\. Rerun command in step 5 to unseal the vault.
 

