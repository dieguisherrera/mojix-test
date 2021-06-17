
import {inject, injectable} from 'inversify';
import MovieDAO from '../../../dao/movieDao';
import {IMovieService} from '../../../services/movie.service';
import {auth} from '../index';
import {Router, Request, Response} from 'express';

export interface IMovieRouter {
    getRouter(): Router;
}

@injectable()
export class MovieRouter implements IMovieRouter{

    @inject("itemService")
    private movieService: IMovieService;

    public getRouter(): Router {

        let router = Router();
        let movieDAO = new MovieDAO();

        // Dao Routes
        router.route('/').get(auth, movieDAO.getAll);
        router.route('/movie').post(auth, this.movieService.register);
        router.route('/movie/:id').get(auth, movieDAO.get);
        router.route('/movie/likes/:id').get(auth, this.movieService.getLikes);
        router.route('/movie/views/:id').get(auth, this.movieService.getLikes);
        router.route('/movie/category/:id').post(auth, this.movieService.setCategory);

        router.delete('/item/:id', (request: Request, response: Response) => {
            movieDAO.delete(request, response);
        });
        return router;
    }
}
