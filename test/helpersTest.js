const { assert } = require('chai');
const bcrypt = require('bcryptjs');
const { findUserByEmail } = require('../helpers.js');

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
  it('should return false user with valid email', function() {
    const user = findUserByEmail("user1@example.com", users)
    const expectedOutput = false;
    assert.isFalse(expectedOutput);
  });
});


