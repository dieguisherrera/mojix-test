import {injectable} from "inversify";
import "reflect-metadata";
import {Request, Response} from 'express';
import {Config} from '../config';
import User from '../model/user';
import Studio from '../model/studio';
import Location from '../model/location';
import Billing from '../model/billing';

const Jwt = require('jsonwebtoken');

export interface IStudioService {
    register(req: Request, res: Response);
}

@injectable()
export class StudioService implements IStudioService {
    /**
     * POST /register
     * Create a new studio.
     */
    public register(request: Request, response: Response) {

        // fetch user and test password verification
        User.findOne({email: request.body.email}, function (err, existingUser: any) {
            if (err) {
                response.status(404).send({
                    authorized: false,
                    error: 'System Error: ' + err,
                    status: response.status,
                    err
                });
                return;
            }

            if (existingUser == null) {
                response.status(404).send({
                    authorized: false,
                    error: 'User not exists.',
                    status: response.status,
                    err
                });
                return;
            }

            // ****************************
            // Create Studio
            // ****************************

            //create location
            let location = new Location({
                lat: request.body.lat,
                lon: request.body.lon
            });
            location.save();

            //create billing
            let billing = new Billing({
                data: request.body.data
            });
            billing.save();

            let studio = new Studio({
                name : request.body.name,
                userId: existingUser.id
            });
            studio.save();

            response.status(200).send({
                authorized: true,
                message: 'Studio registration Successfull.',
                status: response.status
            });
        });
    };

}


