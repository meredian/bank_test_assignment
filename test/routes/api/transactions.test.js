const Promise = require('bluebird');
const chai = require('chai');

const helper = require('../../helper.js');
const server = helper.server;
const knex = helper.knex;

const Accounts = require('../../../models/accounts');

describe('routes : transactions', () => {

  describe('POST /api/transactions', () => {
    beforeEach(() => {
      return Promise.all([
        Accounts.create(1, 100, knex),
        Accounts.create(2, 50, knex)
      ]).then((account_ids) => {
        this.account_id_1 = account_ids[0];
        this.account_id_2 = account_ids[1];
      });
    })


    it('returns new transaction id', () => {
      return chai.request(server)
      .post('/api/transactions')
      .send({
        from_account_id: this.account_id_1,
        to_account_id: this.account_id_2,
        amount: 75
      })
      .then((res) => {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.include.keys('id');
      });
    });

    describe('returns new transaction id', () => {
      beforeEach(() => {
        return chai.request(server)
        .post('/api/transactions')
        .send({
          from_account_id: this.account_id_1,
          to_account_id: this.account_id_2,
          amount: 75
        })
        .then((res) => {
          this.transaction_id = res.body.id;
        });
      })

      it('creates actual new transaction', () => {
        return chai.request(server)
        .get('/api/accounts/' + this.account_id_1 + '/transactions')
        .then((res) => {
          res.body.length.should.equal(1);
          const transaction = res.body[0];
          transaction.from_account_id.should.equal(this.account_id_1);
          transaction.to_account_id.should.equal(this.account_id_2);
          transaction.amount.should.equal(75)
        });
      });

      it('updates balances on both accounts', () => {
        return chai.request(server)
        .get('/api/accounts/' + this.account_id_1)
        .then((res) => {
          res.body.balance.should.equal(25);

          return chai.request(server)
          .get('/api/accounts/' + this.account_id_2)
        })
        .then((res) => {
          res.body.balance.should.equal(125);
        });
      });
    });


    it('returns 404 on non-existing account id', () => {
      return chai.request(server)
      .post('/api/transactions')
      .send({
        from_account_id: 100000000,
        to_account_id: this.account_id_2,
        amount: 75
      })
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(404);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('not_found');
      })
    });

    it('returns 400 on negative money ammount', () => {
      return chai.request(server)
      .post('/api/transactions')
      .send({
        from_account_id: this.account_id_1,
        to_account_id: this.account_id_2,
        amount: -75
      })
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(400);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('bad_request');
      });
    });

    it('returns 402 if sender account has insufficient balance', () => {
      return chai.request(server)
      .post('/api/transactions')
      .send({
        from_account_id: this.account_id_1,
        to_account_id: this.account_id_2,
        amount: 200
      })
      .then(() => { throw new Error('Should fail!'); })
      .catch((err) => {
        err.response.should.have.status(402);
        err.response.body.should.have.property('error');
        err.response.body.error.should.eql('illegal_transaction');
      });
    });

  });

});
