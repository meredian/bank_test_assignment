const express = require('express');
const router = express.Router();
const knex = require('../../db/knex');

const Customers = require('../../models/customers');
const Accounts = require('../../models/accounts');

router.param('customer_id', function(req, res, next, value) {
  req.customer_id = parseInt(value, 10);
  return Customers.get(req.customer_id, knex).then((customer) => {
    req.customer = customer;
    return next();
  }).catch(next);
});

/**
 * @api {get} /customers List customers
 * @apiVersion 1.0.0
 * @apiName ListCustomers
 * @apiGroup Customers
 *
 * @apiDescription List available customers
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3000/api/customers
 *
 * @apiSuccess {Object[]} customers       List of customers.
 * @apiSuccess {Number}   customers.id    Customer ID.
 * @apiSuccess {String}   customers.name  Customer name.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       'id': 1,
 *       'name': 'Jane Woods'
 *     }, {
 *      'id': 2,
 *      'name': 'Michael Li'
 *     }]
 */

router.get('/', function(req, res, next) {
  return Customers.list(knex)
  .then((customers) => {
    return res.json(customers);
  }).catch(next);
});

/**
 * @api {get} /customers/:customer_id Get customer info
 * @apiVersion 1.0.0
 * @apiName GetCustomer
 * @apiGroup Customers
 *
 * @apiDescription Shows customer data and his accounts
 *
 * @apiParam {Number} customer_id Customer ID.
 * 
 * @apiExample Example usage:
 * curl -i http://localhost:3000/api/customers/2
 *
 * @apiSuccess {Number}   id                Customer ID.
 * @apiSuccess {String}   name              Customer name.
 * @apiSuccess {Object[]} accounts          List of customer accounts.
 * @apiSuccess {Number}   accounts.id       Account ID.
 * @apiSuccess {Number}   accounts.balance  Account balance in cents.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'id': 1,
 *       'name': 'Jane Woods'
 *       'accounts': [{
 *         'id': 2,
 *         'balance': 100
 *       }]
 *     }
 *
 * @apiError NotFound The <code>id</code> of the Customer was not found.
 * @apiErrorExample Response (example):
 *     HTTP/1.1 404 Not Authenticated
 *     {
 *       "error": "not_found",
 *       "message": "Customer not found"
 *     }
 */

router.get('/:customer_id', function(req, res, next) {
  const customer = req.customer;
  return Accounts.list(customer.id, knex)
  .then((accounts) => {
    customer.accounts = accounts;
    return res.json(customer);
  }).catch(next);
});

module.exports = router;
