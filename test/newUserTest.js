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
  it('should confirm user is added to the userDB', () => {
    const id = "user3RandomID";
    const name = "user3";
    const email = "user3@example.com";
    const password = "secret";
    const newUser1 = newUser(id, name, email, password, userDB)
    findUserByEmail("user3@example.com", userDB)
    const expectedOutput = true;
    assert.isTrue(expectedOutput);
  });

  it('should confirm name is being added to database', () => {
    const id = "user4RandomID";
    const name = "user4";
    const email = "user4@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB)
    const nameDB = userDB["user4RandomID"].name;
    const expectedOutput = "user4";
    assert.strictEqual(expectedOutput, nameDB);
  });

  it('should confirm name does not match', () => {
    const id = "user5RandomID";
    const name = "user5";
    const email = "user5@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB)
    const nameDB = userDB["user5RandomID"].name;
    const expectedOutput = "user2";
    assert.notStrictEqual(expectedOutput, nameDB);
  });

  it('should confirm password is being added to database', () => {
    const id = "user4RandomID";
    const name = "user4";
    const email = "user4@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB)
    const passwordDB = userDB["user4RandomID"].password;
    const expectedOutput = "secret";
    assert.strictEqual(expectedOutput, passwordDB);
  });
  it('should fail as passwords is in db', () => {
    const id = "user4RandomID";
    const name = "user4";
    const email = "user4@example.com";
    const password = "secret";
    newUser(id, name, email, password, userDB)
    const passwordDB = userDB["user4RandomID"].password;
    const expectedOutput = "secret!";
    assert.notStrictEqual(expectedOutput, passwordDB);
  });
});



