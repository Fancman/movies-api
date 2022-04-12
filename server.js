let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 8080;
let movie = require('./app/routes/movie');
let config = require('config');

let options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
};

// Tutorial: https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai

//db connection
mongoose.connection.openUri(config.DBHost, (err, res) => {
  if (err) throw err;

  console.log('MongoDB Connected');
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) =>
  res.json({ message: 'Welcome to our Movie Reviews API!' })
);

app.route('/movie')
	.get(movie.getMovies)
	.post(movie.postMovie);
app
  .route('/movie/:id')
  .get(movie.getMovie)
  .delete(movie.deleteMovie)
  .put(movie.updateMovie);

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app; // for testing


var movies = [
	{
		'name': 'The Tragedy of Macbeth',
		'actors': [
			'Joel Coen',
			'Denzel Washington'
		],
		'genres': [
			'Drama',
			'Thriller',
			'War'
		],
		'description': 'A Scottish lord becomes convinced by a trio of witches that he will become the next King of Scotland, and his ambitious wife supports him in his plans of seizing power.',
		'image': 'https://m.media-amazon.com/images/M/MV5BMzM0YWNmMDEtNmI3Yy00NjQ4LWJlZjMtMzk2YjUxOThhZGQxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX675_.jpg'
	},
	{
		'name': 'The Northman',
		'actors': [
			'Alexander Skarsgård',
			'Nicole Kidman'
		],
		'genres': [
			'Action',
			'Adventure',
			'Drama'
		],
		'description': `From visionary director Robert Eggers comes The Northman, an action-filled epic that follows a young Viking prince on his quest to avenge his father's murder.`,
		'image': 'https://m.media-amazon.com/images/M/MV5BMzVlMmY2NTctODgwOC00NDMzLWEzMWYtM2RiYmIyNTNhMTI0XkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_.jpg'
	},
	{
		'name': 'Last Night in Soho',
		'actors': [
			'Thomasin McKenzie',
			'Anya Taylor-Joy'
		],
		'genres': [
			'Mystery',
			'Horror',
			'Drama'
		],
		'description': `An aspiring fashion designer is mysteriously able to enter the 1960s where she encounters a dazzling wannabe singer. But the glamour is not all it appears to be and the dreams of the past start to crack and splinter into something darker.`,
		'image': 'https://m.media-amazon.com/images/M/MV5BNGJhODg1ODctMGVlNC00ZTdlLThkZTgtNmU5YzE0OWE4NTMxXkEyXkFqcGdeQXVyNzYyOTM1ODI@._V1_.jpg'
	},
	{
		'name': 'Nightmare Alley',
		'actors': [
			'Thomasin McKenzie',
			'Anya Taylor-Joy'
		],
		'genres': [
			'Crime',
			'Thriller',
			'Drama'
		],
		'description': `A grifter working his way up from low-ranking carnival worker to lauded psychic medium matches wits with a psychiatrist bent on exposing him.`,
		'image': 'https://m.media-amazon.com/images/M/MV5BOTI4NDhhNGEtZjQxZC00ZTRmLThmZTctOGJmY2ZlOTc0ZGY0XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1012_.jpg'
	}
]

async function createMovies(){
	let Movie = require('./app/models/movie');

	for( const idx in movies ){
		let findMovie = await Movie.findOne({ name: movies[idx].name }).exec()

		if( !findMovie )
		{
			let newMovie = new Movie(movies[idx]);
			await newMovie.save()
		}
	}
}

createMovies()