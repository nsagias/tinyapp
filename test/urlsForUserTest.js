const { assert } = require('chai');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { urlsForUser } = require('../helpers.js');

const userDB = {
  "815bd08a": {
    id: "815bd08a",
    name: "red",
    email: "red@example.com",
    password: bcrypt.hashSync('red', 10)
  },
  "ec3bdf7a": {
    id: "ec3bdf7a",
    name: "green",
    email: "green@example.com",
    password: bcrypt.hashSync('green', 10)
  },
  "1f1ffea1": {
    id: "1f1ffea1",
    name: "blue",
    email: "blue@example.com",
    password: bcrypt.hashSync('blue', 10)
  }
};


let urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "1f1ffea1",
    createdAt: moment().format('MMMM Do YYYY')
  },
  "9sm5xk": {
    longURL: "http://www.google.com",
    userID: "1f1ffea1",
    createdAt: moment().format('MMMM Do YYYY'),
  },
  "9sm511": {
    longURL: "http://www.bingo.com",
    userID: "815bd08a",
    createdAt: moment().format('MMMM Do YYYY'),
  },
  "c2k511": {
    longURL: "http://www.yahoo.com",
    userID: "815bd08a",
    createdAt: moment().format('MMMM Do YYYY'),
  }
};


describe('urlsForUser', () => { 
  it('should return user 815bd08a\'s short urls', () => {
    const today = moment().format('MMMM Do YYYY');
    const output = urlsForUser("815bd08a", urlDatabase);
    const expectedOutput = {
      '9sm511': { 
        longURL: 'http://www.bingo.com',
        createdAt: today
      },
      c2k511: { 
        longURL: 'http://www.yahoo.com',
        createdAt: today
      },
    };
    assert.deepEqual(output, expectedOutput);
  });
  it('should return not return 815bd08a\'s short urls', () => {
    const output = urlsForUser("815bd08a", urlDatabase);
    const expectedOutput = {
      b2xVn2: { longURL: 'http://www.lighthouselabs.ca' },
      '9sm5xk': { longURL: 'http://www.google.com' }
    };
    assert.notDeepEqual(output, expectedOutput);
  });
  it('should return empty object if no user or inccorect id', () => {
    const output = urlsForUser("815bd0afdsa", urlDatabase);
    const expectedOutput = {};
    assert.deepEqual(output, expectedOutput);
  });
  it('should return empty object if empty string passed in', () => {
    const output = urlsForUser("", urlDatabase);
    const expectedOutput = {};
    assert.deepEqual(output, expectedOutput);
  });
  it('should return empty object if empty urlDatabase values passed', () => {
    let emptyDB;
    const output = urlsForUser("", emptyDB);
    const expectedOutput = {};
    assert.deepEqual(output, expectedOutput);
  });
  it('should throw an error if Database is empty', () => {
    const expectedOutput = "database is not defined";
    assert.throws(() => urlsForUser("", database), Error, expectedOutput);
  });
 
});


