const chai = require('chai');
const expect = chai.expect;

const helper = require('../../helper.js');
const server = helper.server;
const knex = helper.knex;

const Accounts = require('../../../models/accounts');
const Transactions = require('../../../models/transactions');

describe('routes : accounts', () => {

  describe('GET /api/accounts/:account_id', () => {

    it('retrieves balance for a given account', () => {
      return Accounts.create(1, 100, knex)
      .then((account_id) => {
        return chai.request(server)
        .get('/api/accounts/1')
        .then((res) => {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.include.keys(
            'id', 'balance'
          );
          res.body.id.should.equal(1);
          res.body.balance.should.equal(100);
        });
      });
    });

    it('returns 404 on non-existing account id', () => {
      return chai.request(server)
      .get('/api/accounts/1000000')
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(404);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('not_found');
      });
    });

  });

  describe('GET /api/accounts/:account_id/transactions', () => {

    beforeEach(() => {
      return Promise.all([
        Accounts.create(1, 100, knex),
        Accounts.create(2, 50, knex),
        Accounts.create(3, 150, knex)
      ]).then((account_ids) => {
        this.account_ids = account_ids;
        this.to_account = account_ids[1];

        return Promise.all([
          Transactions.create(this.account_ids[0], this.to_account, 25, knex),
          Transactions.create(this.account_ids[2], this.to_account, 45, knex)
        ]);
      }).then((transaction_ids) => {
        this.transaction_ids = transaction_ids;
      });
    })
    
    it('shows list of transactions for given account', () => {
      return chai.request(server)
      .get('/api/accounts/' + this.to_account + '/transactions')
      .then((res) => {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.length.should.eql(2);
        res.body[0].should.include.keys(
          'id', 'from_account_id', 'to_account_id', 'amount', 'created_at'
        );
      });
    });

    it('returns 404 on non-existing account id', () => {
      return chai.request(server)
      .get('/api/accounts/10000/transactions')
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(404);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('not_found');
      })
    });

  });

  describe('POST /api/accounts/', () => {

    it('returns new account id', () => {
      return chai.request(server)
      .post('/api/accounts')
      .send({customer_id: 1, balance: 100})
      .then((res) => {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.include.keys('id');
      });
    });

    it('creates a new account for a customer with given initial deposit', () => {
      return chai.request(server)
      .post('/api/accounts')
      .send({customer_id: 1, balance: 100})
      .then((res) => {
        const account_id = res.body.id;
        return chai.request(server)
        .get('/api/accounts/' + account_id);
      })
      .then((res) => {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.balance.should.equal(100);
      });
    });

    it('returns 404 on non-existing customer_id', () => {
      return chai.request(server)
      .post('/api/accounts')
      .send({customer_id: 1000, balance: 100})
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(404);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('not_found');
      })
    });

    it('returns 400 on request with negative money amount', () => {
      return chai.request(server)
      .post('/api/accounts')
      .send({customer_id: 1, balance: -100})
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(400);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('bad_request');
      });
    });

    it('returns 400 on request missing fields', () => {
      return chai.request(server)
      .post('/api/accounts')
      .send({customer_id: 1})
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(400);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('bad_request');
      });
    });

  });

});
