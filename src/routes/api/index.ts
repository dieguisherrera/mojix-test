import {Router} from "express";
import {IMovieRouter} from './movie/movie.router';
import {IUserRouter} from './users/user.router';
import {inject, injectable} from "inversify";
import "reflect-metadata";
import jwt = require('express-jwt');
import {IStudioRouter} from './studio/studio.router';
import {Config} from '../../config';


export interface IApi {
    getRouter(): Router;
}

export const auth = jwt({
    secret: Config.privateKey,
    algorithms: ['HS256']
});


@injectable()
export class Api implements IApi {

    @inject("movieRouter")
    private movieRouter: IMovieRouter;

    @inject("userRouter")
    private userRouter: IUserRouter;

    @inject("studioRouter")
    private studioRouter: IStudioRouter;

    public getRouter(): Router {

        let router = Router();

        // split up route handling
        router.use('/movies', this.movieRouter.getRouter());
        router.use('/studio', this.studioRouter.getRouter());
        router.use('/users', this.userRouter.getRouter());

        router.use('/', (msg: any, res: any, next) => {
            res.send({
                message: 'I am a server'
            });
            next();
        });

        // error handlers
        // Catch unauthorised errors
        router.use((err: any, req, res: any, next) => {
            if (err.name === 'UnauthorizedError') {
                res.status(401);
                res.json({"message": err.name + ": " + err.message});
            }
            next();
        });

        return router;

    }

}