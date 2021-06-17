import * as mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: String,
    description: String,
    duration: Number,
    categoryId: String,
    views: Number,
    likes: Number
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
