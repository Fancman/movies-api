let chai = require('chai');
const chaiHttp = require('chai-http');
let app = require('../server');

chai.should();

chai.use(chaiHttp);

describe('GET /movie', () => {
  it('It should GET all the movies', (done) => {
    chai
      .request(app)
      .get('/movie')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eq(4);
        done();
      });
  });
});

describe('GET /movie', () => {
	it('Movies are returning right types for fields', (done) => {
	  chai
		.request(app)
		.get('/movie')
		.end((err, res) => {
			res.should.have.status(200);
			let movies = res.body
        	movies.should.be.a('array');

			movies.forEach(movie => {
				movie.name.should.be.a("string");
				movie.actors.should.be.a("array");
				movie.genres.should.be.a("array");
				movie.description.should.be.a("string");
				movie.image.should.be.a("string");
			});
		  done();
		});
	});
});


describe('/POST movie', () => {
	it('should not create movie with duplicate title', (done) => {
		let movie = {
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
		}
		chai.request(app)
			.post('/movie')
			.send(movie)
			.end((err, res, body) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
			done();
		});
	});

});

describe('/POST movie', () => {
	it('should not create movie if required fields are missing', (done) => {
		let movie = {
			'name': 'The Tragedy of Macbeth',
			'actors': [
				'Joel Coen',
				'Denzel Washington'
			],
			'description': 'A Scottish lord becomes convinced by a trio of witches that he will become the next King of Scotland, and his ambitious wife supports him in his plans of seizing power.',
			'image': 'https://m.media-amazon.com/images/M/MV5BMzM0YWNmMDEtNmI3Yy00NjQ4LWJlZjMtMzk2YjUxOThhZGQxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX675_.jpg'
		}
		chai.request(app)
			.post('/movie')
			.send(movie)
			.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
				done();
			});
	});

});