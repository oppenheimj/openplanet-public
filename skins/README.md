# webgl-server

This backend has two pieces:
- `src/webSocketServer.js` stores information about who is connected, their position, and look orientation. See `src/Player.js` for the stuff that is stored.
- `src/api.js` is an API used for retrieving mesh data, like the cow.

## setup
Install dependencies
```
$ npm install
```

Run the backend
```
$ npm run start
```

Note: There is currently no `.env` file. The webSocketServer and mesh API are served on ports 8090 and 8091, respectively. This information will eventually be pulled from a `.env` file.
