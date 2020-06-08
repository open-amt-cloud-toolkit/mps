# Developer mode 

## Intro
	Developer mode disables database and vault external dependencies and instead uses local flat files for device credentials, domains and profiles. When the Developer mode switch is set to true, vault and database options are turned off regardless of configuration.
### MPS
	- Config.json option:
		- "Usevault" 
			  - true - store device credentials in vault.
			  - false - store device credentials in json file configured in "credentialspath".
		- "developermode" 
			  - true - forces "Usevault" to false.
			  - false - no affect.

### RPS
	- app.config.dev.json options:
		- "VaultConfig:usevault"
			  - true - stores device credentials, as well as domain and profile passwords in vault.
			  - false - store device credentials in json file.
		- "DbConfig:useDbForConfig"  
			  - true - stores domain and profile information in the database.
			  - false - store profile and domain information in app.config.dev.json and device credentials in json file referred in config option "credentialspath".
		- "Devmode" 
			  - true - forces "VaultConfig:usevault" and "DbConfig:useDbForConfig" to false.
			  - false - no affect.
		

### .env setting
	- "DEVELOPER_MODE" - enables developer mode for mps and rps.
	- "USEVAULT" - enables vault use in mps and rps.
	- "USE_DB_PROFILES" - rps stores domains and profiles in database. Note: when "USEVAULT" is set to true, passwords are stored in vault for domains and profiles.
	- "RPS_CREDENTIALS_PATH" - rps path for json credential file for device credentials.
	- "CREDENTIALS_PATH" - mps path for json credential file for device credentials.
