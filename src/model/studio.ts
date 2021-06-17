import * as mongoose from 'mongoose';

const studioSchema = new mongoose.Schema({
    name: String,
    userId: {type: String},
    billingId: {type: String},
    locationId: {type: String}
});

const Studio = mongoose.model('Studio', studioSchema);

export default Studio;
