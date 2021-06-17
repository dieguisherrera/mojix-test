import {Router} from 'express';
import {inject, injectable} from 'inversify';
import StudioDAO from '../../../dao/studioDao';
import {auth} from '../index';
import {StudioService} from '../../../services/studio.service';

export interface IStudioRouter {
    getRouter(): Router;
}

@injectable()
export class StudioRouter implements IStudioRouter{

    @inject("studioService")
    private studioService: StudioService;

    public getRouter(): Router {

        let router = Router();
        let studioDAO = new StudioDAO();

        // Cats
        router.route('/').get(auth, studioDAO.getAll);
        router.route('/studio/register').post(this.studioService.register);
        router.route('/studio/:id').get(auth, studioDAO.get);
        router.route('/studio/:id').delete(auth, studioDAO.delete);

        return router;
    }
}
