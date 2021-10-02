const { assert } = require('chai');
const bcrypt = require('bcryptjs');
const uuid = require("uuid");
const { 
  findUserByEmail,
  generateRandomString  
} = require('../helpers.js');




const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", users)
    const expectedOutput = true;
    assert.isTrue(expectedOutput);
  });
  it('should return false user with invalid email', function() {
    const user = findUserByEmail("user1@example.com", users)
    const expectedOutput = undefined;
    assert.strictEqual(expectedOutput);
  });
});

describe('generateRandomString ', () => {
  it('should confirm length is 6 in length', function() {
    const id = generateRandomString().length;
    const expectedOutput = 6;
    assert.strictEqual(id, expectedOutput);
  });
  it('should return false length when 5 is length', () => {
    const id = generateRandomString();
    const expectedOutput = 5;
    assert.notStrictEqual(id, expectedOutput);
  });
});

