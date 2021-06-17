import * as request from "supertest";
import app from "../src/app";
import Category from '../src/model/category';
import Movie from '../src/model/movie';

const movie_params = require('./factories/movies/create');
const category_params = require('./factories/category/create');

describe("POST /movie/", () => {
  it("should return 200 OK", (done) => {
    request(app).post("/movie", movie_params)
      .expect(200, done);
  });
  it("should set category 200 OK", (done) => {
    let movie = new Movie(movie_params);
    movie.save();
    
    let category = new Category(category_params);
    category.save();

    request(app).post(`/movie/category/${movie.id}`, category_params)
      .expect(200).then(res => {
        Movie.findOne({_id: movie._id}, function (err, newMovie: any) {
          expect(newMovie.categoryId).toEqual(category.id)
        });
        done();
       });
  });
});
