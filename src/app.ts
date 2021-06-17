
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as compression from 'compression';
import * as cors from "cors";
import {Config} from './config';
import {Api, IApi} from './routes/api';

import {UserRouter, IUserRouter} from './routes/api/users/user.router';
import {Container} from "inversify";
import {Connection, IConnection} from "./services/connection";
import {UserService, IUserService} from "./services/user.service";
import {IMovieRouter, MovieRouter} from './routes/api/movie/movie.router';
import {IMovieService, MovieService} from './services/movie.service';
import {IStudioRouter, StudioRouter} from './routes/api/studio/studio.router';
import {IStudioService, StudioService} from './services/studio.service';

// Creates and configures an ExpressJS web server.
class App {

    public container = new Container({defaultScope: "Singleton"});

    // ref to Express instance
    public app: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {

        // DI injected! excellent :)
        // ====================================================================

        //services 
        this.container.bind<IConnection>("connection").to(Connection);
        this.container.bind<IUserService>("userService").to(UserService);
        this.container.bind<IMovieService>("movieService").to(MovieService);
        this.container.bind<IStudioService>("studioService").to(StudioService);
        
        //routers
        this.container.bind<IMovieRouter>("movieRouter").to(MovieRouter);
        this.container.bind<IUserRouter>("userRouter").to(UserRouter);
        this.container.bind<IStudioRouter>("studioRouter").to(StudioRouter);
        this.container.bind<IApi>("api").to(Api);

        this.app = express();
        this.middleware();
        this.routes();
        const swagger = require("swagger-generator-express");
        const options = {
            title: "swagger-generator-express",
            version: "1.0.0",
            host: "localhost:3000",
            basePath: "/",
            schemes: ["http", "https"],
            securityDefinitions: {
                Bearer: {
                    description: 'Example value:- Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQwMGJhNTJjYjJjM',
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header'
                }
            },
            security: [{
                Bearer: []
            }],
            defaultSecurity: 'Bearer'
        };
        
        swagger.serveSwagger(this.app, "/swagger", options, {
            routePath: './src/routes/',
            requestModelPath: './src/model',
            responseModelPath: './src/model'
        });
    }

    // Configure Express middleware.
    private middleware(): void {

        // BASE SETUP
        // =============================================================================

        this.app.use(logger('dev'));

        // configure app to use bodyParser()
        // this will let us get the data from a POST
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        //options for cors midddleware
        const options:cors.CorsOptions = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };

        //use cors middleware
        this.app.use(cors(options));

        //serve images publicly in public/images folder
        this.app.use(express.static(__dirname + '/../public/'));
        mongoose.connect(Config.mongoUrl, {
            useMongoClient: true,
        }); // connect to our database

        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at:', p, 'reason:', reason);
            // application specific logging, throwing an error, or other logic here
        });

        process.on('uncaughtException', (err) => {
            console.log('Uncaught exception:', err);
        });

        //compress served files
        this.app.use(compression());


    }

    // Configure API endpoints.
    private routes(): void {

        // ROUTES FOR OUR API
        // =============================================================================

        // middleware to use for all requests
        this.app.use(function (req, res, next) {
            // do logging
            console.log('Something is happening 2.');
            next(); // make sure we go to the next routes and don't stop here
        });

        // REGISTER OUR ROUTES -------------------------------
        // all of our routes will be prefixed with /api

        //Router definition is here
        let apiRouter: IApi = this.container.get("api");
        this.app.use('/api', apiRouter.getRouter());

        // test route to make sure everything is working (accessed at GET http://localhost:3001/api)
        this.app.use('/', function (req, res) {
            res.json({message: 'hooray! welcome to our api! please append /api to access functions'});
        });


    }
}

export default new App().app;
