const { assert } = require('chai');
const bcrypt = require('bcryptjs');
const { authenticateByPassword } = require('../helpers.js');

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

describe('authenticateByPassword', () => {
  it('Should return userID if user authenticated', () => {
    const userID = authenticateByPassword("red@example.com", "red", userDB);
    const expectedOutput = "815bd08a";
    assert.strictEqual(expectedOutput, userID);
  });
  it('Should return undefined if not authenticated using wrong password', () => {
    const userID = authenticateByPassword("red@example.com", "re", userDB);
    const expectedOutput = undefined;
    assert.strictEqual(expectedOutput, userID);
  });
  it('should throw an error if Database is empty', () => {
    const expectedOutput = "database is not defined";
    assert.throws(() => authenticateByPassword("red@example.com", "red", database), Error, expectedOutput);
  });
 
});

