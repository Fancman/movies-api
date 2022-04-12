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

app.route('/movie').get(movie.getMovies).post(movie.postMovie);
app
  .route('/movie/:id')
  .get(movie.getMovie)
  .delete(movie.deleteMovie)
  .put(movie.updateMovie);

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app; // for testing
