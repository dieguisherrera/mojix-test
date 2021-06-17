import CoreDAO from './coreDao';
import Billing from '../model/billing';

export default class BillingDao extends CoreDAO {
  model = Billing;
}
