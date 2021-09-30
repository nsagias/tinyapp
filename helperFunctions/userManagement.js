const uuid = require("uuid");

const generateRandomString = () => {
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
  return false;
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
  for (let user in usersDB) {
    if( usersDB[user].email  === email ) { 
        if(usersDB[user].password === password) {
          return usersDB[user].id;
        }
    }
  }
};



module.exports = {
  generateRandomString,
  userId,
  findUserByEmail,
  newUser,
  authenticateByPassword
};