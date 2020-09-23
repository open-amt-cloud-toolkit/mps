### Install Vault

1. Create a folder in a directory of your choice, and browse to it using a Command Prompt or terminal window (as Administrator, if on Windows).

2. Clone the following Vault-helm repository and install it.

   ```
   git clone https://github.com/hashicorp/vault-helm.git
   cd vault-helm
   git checkout v0.2.1
   helm install vault .
   ```

3. Periodically, check the status of the vault pod until it is in the *Running* state. **Copy and save the Vault Pod's name.** Usually, the Vault pod is named 'vault-0'. The Vault Pod's name is shown in the first column of the `kubectl get pods` command.

   ```
   kubectl get pods
   ```
   An example of the pod status is below:
   ```
   NAME      READY   STATUS    RESTARTS   AGE
   vault-0   0/1     Running   0          114s
   ```

4. Initialize the vault using the following command:

   ```
   kubectl exec -it [vault-pod-name] -- vault operator init -n 1 -t 1
   ```

5. On completion, the output will display the Unseal Key and Initial Root Token. **Copy and save both values for future use.** These values will be used to unseal and enable the Vault as well as create the necessary secrets.

   ```
   Unseal Key 1: MG+pLyiasq11B/o7hEbctkrTIpGaVDqja3SWJzSLgs0=

   Initial Root Token: s.Wvxni2SudRB0R91fLOaGFS6h

   Vault initialized with 1 key shares and a key threshold of 1. Please securely
   distribute the key shares printed above. When the Vault is re-sealed,
   restarted, or stopped, you must supply at least 1 of these keys to unseal it
   before it can start servicing requests.
   ```

### Unseal Vault

1. Unseal the Vault using your Unseal Key 1 in your Command Prompt or terminal window.

   ```
   kubectl exec -it [vault-pod-name] -- vault operator unseal [unseal-key-1-from-init-command]
   ```

   Example Output:
   ```
   Key             Value
   ---             -----
   Seal Type       shamir
   Initialized     true
   Sealed          false
   Total Shares    1
   Threshold       1
   Version         1.2.4
   Cluster Name    vault-cluster-9a51d062
   Cluster ID      3a25afe3-ad48-e8bf-1afa-c924f046c746
   HA Enabled      false
   ```

### Enable Vault at a Path

For this example, we are going to use a key/value secrets engine. Enable it using the following commands:

1. Log in to Vault using your initial root token from initializing Vault in Step 3.i.5

   ```
   kubectl exec -it [vault-pod-name] -- vault login [your-initial-root-token]
   ```
   
2. Then, enable the 'kv' secrets engine.

   ```
   kubectl exec -it [vault-pod-name] -- vault secrets enable -version=2 kv
   ```