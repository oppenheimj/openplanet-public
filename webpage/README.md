# webgl

## setup
Install dependencies
```
$ npm install
```

Rename `.env_example` to `.env` and fill out with values like
```
webSocketServer=ws://localhost:8090
skinServer=http://localhost:8091
```

Bundle the Javascript into one file using Webpack. The `--watch` parameter auto rebuilds every time a change is made to the Javascript.
```
$ npx webpack --watch
```

Use Express to serve the page `index.html` on http://localhost:8080. Express similarly auto reloads using Nodemon.
```
$ npm run start
```

So every time you make a change, it will take a few seconds for the code to refresh, and then you can refresh your browser to see the changes.
