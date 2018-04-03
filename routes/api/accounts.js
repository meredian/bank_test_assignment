const express = require('express');
const validate = require('express-jsonschema').validate;

const router = express.Router();
const knex = require('../../db/knex');

const Customers = require('../../models/customers');
const Accounts = require('../../models/accounts');
const Transactions = require('../../models/transactions');

const CreateAccountSchema = {
    type: 'object',
    properties: {
      customer_id: {
        type: 'integer',
        minimum: 1,
        required: true
      },
      balance: {
        type: 'integer',
        minimum: 0,
        required: true
      },
    }
}

router.param('account_id', function(req, res, next, value) {
  req.account_id = parseInt(value, 10);
  return Accounts.get(req.account_id, knex).then((customer) => {
    req.customer = customer;
    return next();
  }).catch(next);
});

/**
 * @api {post} /accounts Create account
 * @apiVersion 1.0.0
 * @apiName CreateAccount
 * @apiGroup Accounts
 *
 * @apiDescription Creates account for specific user with initial balance
 *
 * @apiParam {Number} customer_id  Customer ID of account owner
 * @apiParam {Number{0-...}} balance      Initial account balance
 * @apiParamExample {json} Request-Example:
 *     {
 *       "customer_id": 1,
 *       "balance": 100
 *     }
 *
 * @apiExample Example usage:
 * curl -X POST -d '{"customer_id":1, "balance": 100}' -H "Content-Type: application/json" http://localhost:3000/api/accounts
 *
 * @apiSuccess {Number}   id    New account ID.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'id': 2,
 *     }
 *
 * @apiError NotFound The <code>id</code> of the Customer was not found.
 * @apiError BadRequest Request has incorrect format.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 404 Not Authenticated
 *     {
 *       "error": "not_found",
 *       "message": "Customer not found"
 *     }
 */
 
router.post('/', validate({body: CreateAccountSchema}), function(req, res, next) {
  const customer_id = req.body.customer_id;
  const balance = req.body.balance;

  return Customers.get(customer_id, knex)
  .then((customer) => {
    return Accounts.create(customer_id, balance, knex)
    .then((account_id) => {
      return res.json({id: account_id});
    });
  }).catch(next);
});

/**
 * @api {get} /accounts/:account_id Get account info
 * @apiVersion 1.0.0
 * @apiName GetAccount
 * @apiGroup Accounts
 *
 * @apiDescription Shows account info and balance
 *
 * @apiParam {Number} account_id Account ID.
 * 
 * @apiExample Example usage:
 * curl -i http://localhost:3000/api/accounts/2
 *
 * @apiSuccess {Number}   id       Account ID.
 * @apiSuccess {Number}   balance  Account balance in cents.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'id': 1,
 *       'balance': 100
 *     }
 *
 * @apiError NotFound The <code>id</code> of the Account was not found.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 404 Not Authenticated
 *     {
 *       "error": "not_found",
 *       "message": "Account not found"
 *     }
 */

router.get('/:account_id', function(req, res, next) {
  return Accounts.get(req.account_id, knex)
  .then((account) => {
    return res.json(account);
  }).catch(next);
});


/**
 * @api {get} /accounts/:account_id/transactions Show account transactions
 * @apiVersion 1.0.0
 * @apiName ShowAccountTransactions
 * @apiGroup Transactions
 *
 * @apiDescription Shows array of incoming and outgoing account transactions
 *
 * @apiParam {Number} account_id Account ID.
 * 
 * @apiExample Example usage:
 * curl -i http://localhost:3000/api/accounts/1/transactions
 *
 * @apiSuccess {Object[]} responce                  List of account transactions.
 * @apiSuccess {Number}   responce.id               Transaction ID.
 * @apiSuccess {Number}   responce.from_account_id  From account ID.
 * @apiSuccess {Number}   responce.to_account_id    To account ID.
 * @apiSuccess {Number}   responce.amount           Transaction amoun in cents.
 * @apiSuccess {String}   responce.created_at       Created at datestamp
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       'id': 1,
 *       'from_account_id':1,
 *       'to_account_id':2
 *       'amount': 100
 *       'created_at': '2017-04-27T03:53:28.979Z',
 *     }]
 *
 * @apiError NotFound The <code>id</code> of the Account was not found.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 404 Not Authenticated
 *     {
 *       "error": "not_found",
 *       "message": "Account not found"
 *     }
 */

router.get('/:account_id/transactions', function(req, res, next) {
  const account_id = req.account_id;

  return Accounts.get(account_id, knex)
  .then((account) => {
    return Transactions.list(account_id, knex);
  }).then((transactions) => {
    return res.json(transactions);
  }).catch(next);

});

module.exports = router;
