import * as dotenv from 'dotenv';
dotenv.config();

import App from './app'
import * as http from 'http';
import { getConnectionOptions, createConnection } from 'typeorm';


getConnectionOptions().then((connectionOptions) => {
  if (process.env.NODE_ENV === 'production') {
    Object.assign(connectionOptions, {
      entities: [
        __dirname + '/entity/**/*.entity.js'
      ],
      migrations: [
        __dirname + '/migration/**/*.migration.js'
      ],
      subscribers: [
        __dirname + '/subscriber/**/*.subscriber.js'
      ]
    });
  }
  createConnection().then((connection) => {
    console.log(`${connection.name} database ${connection.options.database} connected!`);
    const onError = (error: NodeJS.ErrnoException): void => {
      if (error.syscall !== 'listen') throw error;
      let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
      switch(error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    }
    
    const onListening = (): void => {
      let addr = server.address();
      let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${port}`;
      console.log(`Listening on ${bind}`);
    }
    
    const normalizePort = (val: number|string): number|string|boolean => {
      let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
      if (isNaN(port)) return val;
      else if (port >= 0) return port;
      else return false;
    }
    
    const app = new App();
    const port = normalizePort(process.env.PORT || 3000);

    const server = http.createServer(app.express);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    console.log(process.env.API_HOST)

  }).catch((e) => {
    console.log('error connecting ', e)

  })
})


