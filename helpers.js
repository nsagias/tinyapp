const bcrypt = require('bcryptjs');
const uuid = require("uuid");


const shortURLGenerator = () => {
  return uuid.v4().substring(0,6)
};

const userId = () => {
  return uuid.v4().substring(0,8)
};

const findUserByEmail = (userEmail, usersDB) => {
  for (let user in usersDB) {
    if (usersDB[user].email === userEmail) {  
      return true;
    } 
  }
  return undefined;
};

const newUser = (id, name, email, password, userDB) => {
  return userDB[id] = {
    id:  id,
    name: name,
    email: email,
    password: password
  };
};


const authenticateByPassword = (email, password, usersDB) => {
  // bcrypt.compareSync(password, hashedPassword);
  for (let user in usersDB) {
    if( usersDB[user].email  === email ) { 
         let storedPassword = usersDB[user].password;
        if(bcrypt.compareSync(password, storedPassword)) {
          return usersDB[user].id;
        }
    }
  }
};

// function takes userId and the urlDatabase
const urlsForUser = (id, db) => {
  let result = {};
  for (let shortURL in db) {
    if (db[shortURL].userID === id) {
      result[shortURL] = {
        longURL : db[shortURL].longURL};
      }
    }
  return result;
};



module.exports = {
  shortURLGenerator,
  userId,
  findUserByEmail,
  newUser,
  authenticateByPassword,
  urlsForUser,
};