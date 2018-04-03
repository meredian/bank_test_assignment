const express = require('express');
const validate = require('express-jsonschema').validate;

const router = express.Router();
const knex = require('../../db/knex');

const Transactions = require('../../models/transactions');

const CreateTransactionSchema = {
  type: 'object',
  properties: {
    from_account_id: {
      type: 'integer',
      minimum: 1,
      required: true
    },
    to_account_id: {
      type: 'integer',
      minimum: 1,
      required: true
    },
    amount: {
      type: 'integer',
      minimum: 1,
      required: true
    },
  }
}

/**
 * @api {post} /transactions Create transaction
 * @apiVersion 1.0.0
 * @apiName CreateTransaction
 * @apiGroup Transactions
 *
 * @apiDescription Creates transaction from one account to another.
 * Source and target accounts must not be the same. Money amount should be int > 0
 *
 * @apiParam {Number} from_account_id  Source Account ID
 * @apiParam {Number} to_account_id    Target Account ID
 * @apiParam {Number} amount           Amount of money to transfer in cents
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "from_account_id": 1,
 *       "to_account_id": 2,
 *       "amount": 3
 *     }
 *
 * @apiExample Example usage:
 * curl -X POST -d '{"from_account_id":1, "to_account_id":2, "amount": 15}' -H "Content-Type: application/json" http://localhost:3000/api/transactions
 *
 * @apiSuccess {Number}   id    New transaction ID.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'id': 2,
 *     }
 *
 * @apiError NotFound The <code>id</code> for one of Accounts was not found.
 * @apiError IllegalTransaction Transaction violated conditions
 * @apiError BadRequest Request has incorrect format.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 404 Not Authenticated
 *     {
 *       "error": "illegal_transaction",
 *       "message": "Insufficient balance"
 *     }
 */

router.post('/', validate({body: CreateTransactionSchema}), function(req, res, next) {
  const from_account_id = req.body.from_account_id;
  const to_account_id = req.body.to_account_id;
  const amount = req.body.amount;

  return Transactions.create(from_account_id, to_account_id, amount, knex)
  .then((transaction_id) => {
    return res.json({id: transaction_id});  
  })
  .catch(next);
});

module.exports = router;
