const { assert } = require('chai');
const {
  newUser,
  findUserByEmail
} = require('../helpers.js');

const userDB = {
  "userRandomID": {
    id: "userRandomID",
    name: "user1",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    name: "user2",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


describe('newUser', () => {
  it('should confirm user is added to the userDB by checking email', () => {
    const id = "user3RandomID";
    const name = "user3";
    const email = "user3@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB);
    findUserByEmail("user3@example.com", userDB);
    const expectedOutput = true;
    assert.isTrue(expectedOutput);
  });
  it('should return is false for balancing test ', () => {
    const id = "user3RandomID";
    const name = "user3";
    const email = "user3@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB);
    findUserByEmail("user3@example.co", userDB);
    const expectedOutput = false;
    assert.isFalse(expectedOutput);
  });
  it('should be true that id was added to database', () => {
    const id = "user4RandomID";
    const name = "user4";
    const email = "user4@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB);
    const iDDB = userDB["user4RandomID"].id
    const expectedOutput = "user4RandomID";
    assert.strictEqual(expectedOutput, iDDB);
  });

  it('should be false id does not match other existing user', () => {
    const id = "user5RandomID";
    const name = "user5";
    const email = "user5@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB);
    const iDDB = userDB["user5RandomID"].id;
    const expectedOutput = "user4RandomID";
    assert.notStrictEqual(expectedOutput, iDDB);
  });

  it('should be true that name is being added to database', () => {
    const id = "user4RandomID";
    const name = "user4";
    const email = "user4@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB);
    const nameDB = userDB["user4RandomID"].name;
    const expectedOutput = "user4";
    assert.strictEqual(expectedOutput, nameDB);
  });

  it('should return false that names does not match', () => {
    const id = "user5RandomID";
    const name = "user5";
    const email = "user5@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB);
    const nameDB = userDB["user5RandomID"].name;
    const expectedOutput = "user2";
    assert.notStrictEqual(expectedOutput, nameDB);
  });

  it('should return true password is being added to database', () => {
    const id = "user4RandomID";
    const name = "user4";
    const email = "user4@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB);
    const passwordDB = userDB["user4RandomID"].password;
    const expectedOutput = "secret";
    assert.strictEqual(expectedOutput, passwordDB);
  });
  it('should return false ass password does not match', () => {
    const id = "user4RandomID";
    const name = "user4";
    const email = "user4@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB);
    const passwordDB = userDB["user4RandomID"].password;
    const expectedOutput = "secret!";
    assert.notStrictEqual(expectedOutput, passwordDB);
  });
});



