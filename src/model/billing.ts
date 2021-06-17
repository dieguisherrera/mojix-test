import * as mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  data: String
});

const Billing = mongoose.model('Billing', billingSchema);

export default Billing;
