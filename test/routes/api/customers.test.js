const chai = require('chai');

const helper = require('../../helper.js');
const server = helper.server;
const knex = helper.knex;

const Accounts = require('../../../models/accounts');

describe('routes : customers', () => {

  describe('GET /api/customers', () => {

    it('responds with all users', () => {
      return chai.request(server)
      .get('/api/customers')
      .then((res) => {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.length.should.eql(5);
        res.body[0].should.include.keys(
          'id', 'name'
        );
      });
    });

  });

  describe('GET /api/customers/:customer_id', () => {

    it('retrieves list of accounts for a given customer', () => {
      return Accounts.create(1, 100, knex)
      .then((account_id) => {
        return chai.request(server)
        .get('/api/customers/1')
        .then((res) => {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.include.keys(
            'id', 'name', 'accounts'
          );
          res.body.accounts.should.deep.equal([{id: account_id, balance: 100}]);
        });
      });
    });

    it('returns 404 on non-existing customer', () => {
      return chai.request(server)
      .get('/api/customers/123')
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(404);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('not_found');
      });
    });

  });

});
