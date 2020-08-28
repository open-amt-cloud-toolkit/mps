## Attach a Database to RPS

<span style="color:yellow"> **BW Comment**: Has this changed with Q2/Q3 release? Boolean doesn't exist as part of iConfigurator and IF condition is no longer in index.ts</span>

RPS has the option to output device configuration information to a database so that other software components with access to this database can lookup and use the AMT credentials stored there.  Since there are many database options available, RPS takes a flexible approach that allows a developer to implement a simple module in RPS that will allow RPS to then send data to the database implementation of choice.

The following example uses MongoDB as the example database, but the same concepts could be used for other database implementations.

1. Create a file called AmtDeviceMongoDbRepository.ts in the \RPS_MicroServer\src\repositories folder

This module will need to implement the MongoDB types from mongodb and ILogger, AMTDeviceDTO, and IAMTDeviceWriter from RPS.  Below is an example of how this could be implemented:

```javascript
// we imported all types from mongodb driver, to use in code
import { MongoClient, Client, Collection, InsertOneWriteOpResult } from 'mongodb';
import { ILogger } from '../interfaces/ILogger';
import { AMTDeviceDTO } from './dto/AmtDeviceDTO';
import { IAMTDeviceWriter } from './interfaces/IAMTDeviceWriter';

// that class only can be extended
export class AmtDeviceMongoDbRepository implements IAMTDeviceWriter {
    private collection: Collection;
    private client: Client;
    private connectionString: string;
    private databaseName: string;
    private collectionName: string;
    private logger: ILogger;

    constructor(logger: ILogger, connectionString: string, databaseName: string, collectionName: string) {
        this.connectionString = connectionString;
        this.databaseName = databaseName;
        this.collectionName = collectionName;
        this.logger = logger;
    }

    async connect() {
        let connection = await MongoClient.connect(this.connectionString, { useNewUrlParser: true });
        let database = connection.db(this.databaseName);
        this.collection = database.collection(this.collectionName);
    }

    disconnect() {
        if (this.client) {
            this.client.disconnect();
        }
    }

    public async insert(device: AMTDeviceDTO): Promise<boolean> {
        try {
            if (!this.collection) {
                await this.connect();
            }

            let result: InsertOneWriteOpResult = await this.collection.insertOne(device);
            return !!result.result.ok;
        } catch (error) {
            this.logger.error(`exception inserting record: ${JSON.stringify(error)}`);
            return false;
        }
    }
}
```

2. Edit the file index.ts in \RPS_MicroServer\src\ and import the implementation of database module. For example:

```javascript
import {AmtDeviceMongoDbRepository} from './repositories/AmtDeviceMongoDbRepository';
```

3. Edit the file index.ts in \RPS_MicroServer\src\ and set the amtDeviceWriter object to an instance of the repository (under configurator.isAMTDeviceWriterEnabled() located in line 35). For example:

```javascript
amtDeviceWriter = new AmtDeviceMongoDbRepository(Logger("AmtDeviceMongoDbRepository"), configurator.DbConfig.connectionString, configurator.DbConfig.databaseName configurator.DbConfig.collectionName);
```

4. Edit the file package.json and add "mongodb": "^3.3.12" under dev dependencies.

**Ed comment:** Add/copy app.config.dev.json DbConfig content here?

5. Edit app.config.dev.json database info

<span style="color:yellow"> **BW Comment**: Need to update table fields to match JSON file</span>


#### DbConfig: Configure the Database

The DbConfig section configures how RPS connects to a database, which we're not doing for this exercise. Set DbEnabled to *false*, if it isn't already.

| Option       |  Description    |
| :----------- | :-------------- |
| **DbEnabled** | Set to <span style="color:green"><b>true</b></span> to enable database integration. To use GenerateRandomPassword for an Intel&reg; AMT profile, DbEnabled must be set to true. |
| **connectionString** | Specifies how RPS should connect to the database. If DbEnabled is set to *true*, this is required. |
| **databaseName** | Specifies the name of the database that RPS should use. If DbEnabled is set to *true*, this is required. |
| **collectionName** |  Specifies the collection in the database that RPS should use. If DbEnabled is set to *true*, this is required. |
