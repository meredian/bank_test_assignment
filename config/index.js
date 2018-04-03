const env = process.env.NODE_ENV || 'development';

const config = module.exports = require('./' + env);
