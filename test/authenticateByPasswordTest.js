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
    const userID = authenticateByPassword("red@example.com", "red", userDB)
    const expectedOutput = "815bd08a";
    assert.strictEqual(expectedOutput, userID);
  });
  it('Should return undefined if not authenticated using wrong password', () => {
    const userID = authenticateByPassword("red@example.com", "re", userDB)
    const expectedOutput = undefined;
    assert.strictEqual(expectedOutput, userID);
  });
});
  // describe('authenticateByPassword', () => {
  //   it('should confirm user is added to the userDB by checking email', () => {
  //     const id = "user3RandomID";
  //     const name = "user3";
  //     const email = "user3@example.com";
  //     const password = "secret";
  //     newUser(id, name, email, hashedPassword, usersDB);
  //     findUserByEmail("user3@example.com", userDB);
  //     authenticateByPassword(email, password, usersDB)
  //     const expectedOutput = true;
  //     assert.isTrue(expectedOutput);
  //     const hashedPassword = bcrypt.hashSync(password, 10);
  
  //   // add new userID to session
   
  //   });

