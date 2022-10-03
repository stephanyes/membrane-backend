import express, { Request, Response, NextFunction, ErrorRequestHandler, response, RequestHandler} from 'express';
import cors from 'cors';
import { Server } from 'net'
import { ExecutionEnvironmentConfig } from '../config/Environment';
import { checkType, checkParams } from '../middlewares/validations';
import { canPerform, executeOrder, isValidPair, orderbook } from '../controller/Controller';
import { Orderbook } from '../types';
import { ApiStorage } from '../utils/ApiStorage';

const bodyParser = require('body-parser');

export class RestService {
  private server?: Server
  private isServerOn: boolean
  constructor(private apiConfig: ExecutionEnvironmentConfig, private config: ExecutionEnvironmentConfig, private storage: ApiStorage) {
    this.isServerOn = false
  }
  async start(): Promise<void> {
    const app = express();
    this.isServerOn = true;

    const corsOptions = {
      origin: true,
      credentials: true,
      optionSuccessStatus: 200,
    }
    
    app.use(cors(corsOptions))
    app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: false }));

    if (!this.config.testing) 
      this.server = app.listen(this.apiConfig.apiPort, () => {
        console.log(`Server application is ruinning on port ${this.apiConfig.apiPort}.`);
      });

    // Middleware to log server's path
    app.use((request: Request, response: Response, next: NextFunction) => {
      console.log("PATH: ", request.path)
      next()
    })
  
    app.get("/", [function (request: Request, response: Response, next: NextFunction) {
      response.send("HOME")
    }]);
    
    app.get("/orderbook/:pair", [checkType,  (request: Request, response: Response) => {
      const { pair } = request.params
      if (!isValidPair(pair, this.apiConfig.pairs))
        return response.status(400).send({invalidPair: pair})
      let books: Orderbook = orderbook(pair, this.storage)
      response.status(200).send(books)
    }]);
    
    app.get("/simulateOrder/:pair/:opType/:amount", [checkParams, (request: Request, response: Response) => {
      const { pair, opType, amount } = request.params
      if (!canPerform(pair, opType, amount, this.apiConfig))
        return response.status(400).send({message: "Error one parameter is not allower", pair, opType, amount})
      const eftPrice = executeOrder({pair, opType, amount}, this.storage)
      response.send(eftPrice)
    }]);

    app.use((request: Request, response: Response, next: NextFunction) => {
      response.status(404)
      response.send({message: "Invalid Path"})
    })

    app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
      response.status(500).send({message: error.message})
      console.error(error)
    });
  }

  public isOn(): boolean {
    return this.isServerOn
  }

  async stop(): Promise<void> {
    this.isServerOn = false
    await this.server?.close()
  }
}
