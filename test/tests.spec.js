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
