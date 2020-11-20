As stated in the documentation getting started is quite easy, as you only need to understand its core concepts — Entry, Output, Loaders, and plugins.

## Entry:
The entry point such as /src/index.js which is the default for Webpack 4 is what Webpack will use to start building out/resolving its dependencies.

## Output:
Output: The output property such as ./dist (default for Webpack 4) tells Webpack where to output the bundles it creates and how to name them.

## Loaders:
Since Webpack only understands native Javascript code, these loaders enable it to process different types of imported files and convert them into valid modules when it encounters a specific type of file. Loaders have 2 properties in the configuration file
The test property which identifies which file or files should be transformed
The use property which indicates which loader can be used to do the transforming

## Plugins:
This allows you to extend Webpack capabilities to perform a wider range of tasks like bundle optimization, asset management and injection of environment variables. You can check out some of the plugins provided by Webpack here.


## Installing Webpack:
 
install webpack and webpack cli as dev dependencies.

npm i webpack webpack-cli -D webpack-dev-server.


## Configuring Webpack for development enviroment :

Create a Webpack config file webpack.config.dev.js in the root of our project folder.

const path = require('path');
module.exports = {
     mode: "development",
     entry: './src/reactjs/components/DeviceGrid/index.tsx', // entry points can be multiple

}


## Adding Typescript:

Install Typescript’s dependencies.

npm i awesome-typescript-loader -D

## Add Typescript configuration to Webpack:

```
const path = require('path');
module.exports = {
 ....
resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        loader: 'awesome-typescript-loader'
      }
    ]
  }
}
```

Here we are telling Webpack to:
Resolve file extensions with .tsx, .ts and .js
All files with the extension .tsx or .ts should be processed by awesome-typescript-loader

## Add Styles :
Install Styles dependencies.

npm i style-loader css-loader sass-loader -D

update the webpack config file:

```
module.exports = {
 ....

  module: {
    rules: [
        ...
       {
        test: /\.(sc|sa|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ]
  }
}
```

## Adding HTML:

 we need to use a Webpack plugin html-webpack-plugin which helps simplifies the creation of HTML files to help serve our Webpack bundles.

 npm i html-webpack-plugin -D.

 Update the Webpack config file:

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
 ....
  plugins: [
   new HtmlWebpackPlugin({
      filename: 'device.htm',
      template: './src/sample/sampleDG.htm',
      inject: true,
      chunks: ["device"]
    }),
  ]
}
```

## Adding API keys as Environmental variables:

Environmental variables can be setup using the DefinePlugin option in webpack.

```
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    ...
    plugins: [
      new webpack.DefinePlugin({
      'process.env': {
        'API_KEY_RPS': JSON.stringify('<Provide RPS api key>'),
        'API_KEY_MPS': JSON.stringify('<Provide MPS api key>')
      }
    })
    ]
  }
```

These environmental variables can be used inside the code as below,

```
const data = {
  rpsKey: process.env.API_KEY_RPS,
  mpsKey: process.env.API_KEY_MPS
}
```


## Development Server:

we are going to set up a development server using the webpack-dev-server which will open up a default browser when we do npm start and also provide us with live reloading on the fly.

npm i webpack-dev-server --D

## update Package.json

```
"scripts": { 
  "start": "webpack-dev-server --config webpack.config.dev.js"
}
```

Sample usage :
    
        1)open command prompt
        2)Run npm start command
  

## Configuring Webpack for production enviroment :

Create a Webpack config file webpack.config.prod.js in the root of our project folder.

```
const path = require('path');

module.exports = {
     mode: "production",
     entry: './src/reactjs/components/DeviceGrid/index.tsx', // entry points can be multiple
    output: {
        filename: "[name].core.min.js",
        path: path.resolve(__dirname, "./dist")
    },
  ....
}
```

## update Package.json

```
"scripts": { 
 "build": "webpack --config webpack.config.prod.js",
}
```

Sample usage:
   
    1)open command prompt
    2)Run npm run build command

## Configuring Webpack for external enviroment :
   
   Create a Webpack config file webpack.config.externals.js in the root of our project folder.

## Add webpack-node-externals :
 
 Install webpack-node-externals dependencies.

 npm install webpack-node-externals -D

 webpack-node-externals library creates an externals function that ignores node_modules when bundling in Webpack.

```
 const path = require("path"); //No ES6 in webpack config 
 const nodeExternals = require('webpack-node-externals');

module.exports = {
   ....
  externals: [nodeExternals()],
 
};
```

## update Package.json

```
"scripts": { 
 "build-ext": "webpack --config webpack.config.externals.js",
}
```

Sample usage:
   
    1)open command prompt
    2)Run npm run build-ext command


  
