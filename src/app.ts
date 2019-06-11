import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { errorMiddleware } from './middleware/error';
import { loggerMiddleware }  from './middleware/logger';

import UserController from './controller/user.controller';
import AuthController from './controller/auth.controller';

import { User } from './entity/user.entity';
import { IBearerTokenPayload } from './util/encryption';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: IBearerTokenPayload;
    }
  }
}

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware() {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(morgan('dev'));
    this.express.use(cors())
    this.express.use(loggerMiddleware);
  }

  public initializeRoutes() {
    this.express.use('/auth', new AuthController().router);
    this.express.use('/users', new UserController().router);
  }

  private initializeErrorHandling() {
    this.express.use(errorMiddleware);
  }

}

export default App;