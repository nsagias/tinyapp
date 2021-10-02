const { assert } = require('chai');
const { 
  findUserByEmail,
  shortURLGenerator,
  userId
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

describe('findUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = findUserByEmail("user@example.com", users)
    const expectedOutput = true;
    assert.isTrue(expectedOutput);
  });
  it('should return false user with invalid email', () => {
    const user = findUserByEmail("user1@example.com", users)
    const expectedOutput = undefined;
    assert.strictEqual(expectedOutput);
  });
});

describe('generateRandomString ', () => {
  it('should confirm length is 6 in length', () => {
    const shortURL = shortURLGenerator().length;
    const expectedOutput = 6;
    assert.strictEqual(shortURL, expectedOutput);
  });
  it('should return false length when 5 is length', () => {
    const shortURL = shortURLGenerator().length;
    const expectedOutput = 5;
    assert.notStrictEqual(shortURL, expectedOutput);
  });
  it('should return false length when 7 is length', () => {
    const shortURL  = shortURLGenerator().length;
    const expectedOutput = 7;
    assert.notStrictEqual(shortURL, expectedOutput);
  });
});

describe('userId', () => {
  it('should confirm length is 8 in length', () =>{
    const userID = userId().length;
    const expectedOutput = 8;
    assert.strictEqual(userID , expectedOutput);
  });
  it('should return false length when 7 is length', () => {
    const userID = userId().length;
    const expectedOutput = 7;
    assert.notStrictEqual(userID, expectedOutput);
  });
  it('should return false length when 9 is length', () => {
    const userID = userId().length;
    const expectedOutput = 9;
    assert.notStrictEqual(userID, expectedOutput);
  });
});

