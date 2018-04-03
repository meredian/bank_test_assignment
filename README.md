Nice bank api
============

Deployed instance: http://ec2-35-158-16-87.eu-central-1.compute.amazonaws.com:3000/

## Prerequisites

* PostgresSQL 9.2+
* Node 7+

## Installation

  $ npm install

## Run

At first run deed to create database


  $ npm run db:create && npm run db:migrate && npm run db:seed
  # or just use shorthand which fully recreates db
  $ npm run db:reset

Then start service with

  $ npm start

## Testing

  $ npm test

## Also

  See security notes in `security_notes.md`
  
