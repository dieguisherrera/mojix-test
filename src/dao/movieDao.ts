import CoreDAO from './coreDao';
import Movie from '../model/movie';

export default class MovieDAO extends CoreDAO {
  model = Movie;
}
