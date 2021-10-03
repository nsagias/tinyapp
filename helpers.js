const bcrypt = require('bcryptjs');
const uuid = require("uuid");

/**
 * Function to create shortURL identifier for database insertion
 * - used in: app.post("/urls"
 * @returns a 6 character long string aplhanumeric identifier
 */
const shortURLGenerator = () => {
  return uuid.v4().substring(0,6)
};

/**
 * Function to create userID identifer for database insertion
 * - used in: app.post("/register"
 * @returns a 8 character long alphanumeric string
 */
const userId = () => {
  return uuid.v4().substring(0,8)
};


/**
 * Function to confirm user in database
 * used to avoid duplicate user creation
 * - used in: app.post("/register"
 * - used in: app.post("/login"
 * @param {takes a user email} userEmail 
 * @param {takes the database of users} usersDB 
 * @returns true if user in database or undefined
 */
const findUserByEmail = (userEmail, usersDB) => {
  for (let user in usersDB) {
    if (usersDB[user].email === userEmail) {  
      return true;
    } 
  }
  return undefined;
};


/**
 * Function to used to create a new user
 * - used in: app.post("/register"
 * @param {takes the an id from userID function} id 
 * @param {takes the user defined name} name 
 * @param {takes a user defined email} email 
 * @param {takes a hashedPassword } password 
 * @param {takes the users database} userDB 
 * @returns enters the new user into the database "userDB"
 */
const newUser = (id, name, email, password, userDB) => {
  return userDB[id] = {
    id:  id,
    name: name,
    email: email,
    password: password
  };
};

/**
 * Function authenticate user by user defined password
 * Takes user provide email password and compares synchronisely 
 * to password in database
 * - used in: app.post("/login"
 * @param {user provided email at login page} email 
 * @param {user provided password at login page} password 
 * @param {user database with all current users} usersDB 
 * @returns returns a user ID if authenticated or undefined if not authenticated
 */
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

/**
 * Function to lookup and return users
 * - user in: app.get("/urls"
 * @param {takes the userId from the cookie-session} id 
 * @param {takes the current userdabase} db 
 * @returns empty object if nothing found or all the urls based on the userID 
 */
// function takes userId and the urlDatabase
const urlsForUser = (id, db) => {
  let result = {};
  for (let shortURL in db) {
    if (db[shortURL].userID === id) {
      result[shortURL] = {
        longURL : db[shortURL].longURL,
        createdAt: db[shortURL].createdAt
      };
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