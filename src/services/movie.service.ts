import {injectable} from "inversify";
import "reflect-metadata";
import {Request, Response} from 'express';
import Category from '../model/user';
import Movie from '../model/movie';

export interface IMovieService {
    register(req: Request, res: Response);
    setCategory(req: Request, res: Response);
    getLikes(req: Request, res: Response);
    getViews(req: Request, res: Response);
}

@injectable()
export class MovieService implements IMovieService {
    /**
     * POST /register
     * Create a new studio.
     */
    public register(request: Request, response: Response) {
        // ****************************
        // Create movie
        // ****************************

        let movie = new Movie({
            title : request.body.name,
            description: request.body.description,
            duration: request.body.duration,
            views: 0,
            likes: 0
        });
        movie.save();

        response.status(200).send({
            authorized: true,
            message: 'Movie registratio Successfull.',
            status: response.status
        });
    };
    public setCategory(request: Request, response: Response) {
        Category.findOne({name: request.body.name}, function (err, category: any) {
            if (err) {
                response.status(404).send({
                    authorized: false,
                    error: 'System Error: ' + err,
                    status: response.status,
                    err
                });
                return;
            }

            if (category == null) {
                response.status(404).send({
                    authorized: false,
                    error: 'Category not exists.',
                    status: response.status,
                    err
                });
                return;
            }

            // ****************************
            // Assign category
            // ****************************
            const options = { upsert: false };
            const updateMovie = {
                $set: {
                    categoryId: category.id,
                },
            };
            Movie.updateOne({ "_id": request.params.id }, updateMovie, options);
            

            //create billing

            response.status(200).send({
                authorized: true,
                message: 'Movie category Successfull.',
                status: response.status
            });
        });
    };
    public getViews(request: Request, response: Response) {
        Movie.findOne({_id: request.params.id}, function (err, movie: any) {
            if (err) {
                response.status(404).send({
                    authorized: false,
                    error: 'System Error: ' + err,
                    status: response.status,
                    err
                });
                return;
            }

            if (movie == null) {
                response.status(404).send({
                    authorized: false,
                    error: 'Movie not exists.',
                    status: response.status,
                    err
                });
                return;
            }

            //create billing

            response.status(200).send({
                authorized: true,
                message: 'Movie category Successfull.',
                views: movie.views,
                status: response.status
            });
        });
    };
    public getLikes(request: Request, response: Response) {
        Movie.findOne({_id: request.params.id}, function (err, movie: any) {
            if (err) {
                response.status(404).send({
                    authorized: false,
                    error: 'System Error: ' + err,
                    status: response.status,
                    err
                });
                return;
            }

            if (movie == null) {
                response.status(404).send({
                    authorized: false,
                    error: 'Movie not exists.',
                    status: response.status,
                    err
                });
                return;
            }

            //create billing

            response.status(200).send({
                authorized: true,
                message: 'Movie category Successfull.',
                views: movie.likes,
                status: response.status
            });
        });
    };
}


