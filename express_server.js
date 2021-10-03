const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const {
  shortURLGenerator,
  userId,
  findUserByEmail,
  newUser,
  authenticateByPassword,
  urlsForUser
} = require('./helpers');
const moment = require('moment');

app.use(morgan('short'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['the longer the better', 'two is betther than one'],
}));

app.set("view engine", "ejs");


const users = {
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


let urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "1f1ffea1",
    createdAt: moment().format('MMMM Do YYYY'),
  },
  "9sm5xk": {
    longURL: "http://www.google.com",
    userID: "1f1ffea1",
    createdAt: moment().format('MMMM Do YYYY'),
  },
  "9sm511": {
    longURL: "http://www.bingo.com",
    userID: "815bd08a",
    createdAt: moment().format('MMMM Do YYYY'),
  },
  "c2k511": {
    longURL: "http://www.yahoo.com",
    userID: "815bd08a",
    createdAt: moment().format('MMMM Do YYYY')
  }
};


// route redirects to login
app.get("/", (req, res) => {
  const userId = req.session["userID"];
  // return ot login if user not logged in
  if (!userId) {
    return res.redirect('login');
  }
  return res.redirect("/urls");
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>");
// });


app.get("/urls", (req, res) => {
  // get userID from session and check
  const userId = req.session["userID"];
  // return ot login if user not logged in
  if (!userId) {
    return res.redirect('login');
  }
   // get user id from user database
  const user = users[userId];
  // get urs for the user 
  let userURLs = urlsForUser(userId, urlDatabase);
  // add urls to templateVvars with user id
  const templateVars = {
    user: user,
    urls: userURLs,
  };
  res.render('urls_index', templateVars);
});

// route to create new short URL
app.post("/urls", (req, res) => {
  // get user id from cookie
  const userId = req.session["userID"];
  if (!userId) {
    return res.redirect('login');
  }
  // creat new short URL
  const shortURLId = shortURLGenerator();
  // get user id from user database
  const user = users[userId];
  // create new url
  let newURL = {
    longURL: req.body.longURL,
    userID: user.id,
    createdAt: moment().format('MMMM Do YYYY'),
  };
  // put new shortURL in database
  urlDatabase[shortURLId] = newURL;

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  // receives a shoten url from an anonymous user
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  // check if logged in and exit if not logged in
  const userId = req.session["userID"];
  if (!userId) {
    return res.redirect('/login');
  }
  // get user id from user database
  const user = users[userId];
  const templateVars = { user: user };
  // show the create new URL screen
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // get user id from session
  const userId = req.session["userID"];
  // if no userID redirect to login
  if (!userId) {
    res.redirect('login');
  }
  // get user from user database
  const user = users[userId];
  const templateVars = {
    user: user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    createdAt: urlDatabase[req.params.shortURL].createdAt,
  };
  // show single url
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  // get userID from session 
  const userId = req.session["userID"];
  // if customer not logged in redirect to user screen
  if (!userId) {
    return res.redirect('login');
  }
  const shortURLId = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURLId].longURL = longURL;
  urlDatabase[shortURLId].createdAt = moment().format('MMMM Do YYYY'),
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // check if user id and logged ing
  const userId = req.session["userID"];
  if (!userId) {
    return res.redirect('login');
  }
  // if logged in get use provided 
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  // set session value to null
  req.session = null;
  res.redirect("/urls");
});


app.get("/register", (req, res) => {
  // show registration screen
  const templateVars = { user: null };
  res.render("register", templateVars);
});


app.post("/register", (req, res) => {
  // generate a new ID for user
  const id = userId();
  const userID = id;
  // get data from form
  const { name, email, password } = req.body;
  // trim password and email
  // avoid duplicated and getting around check
  const nameT = name.trim()
  const emailT = email.trim();
  const passwordT = password.trim();


  // check for emptry strings in  email or password
  if (emailT === '' || passwordT === '' || nameT ==='') {
    return res.status(400).send('400: Missing Email or Password ');
  }

  // check if is a current user
  const usersDB = users;
  const isCurrentUser = findUserByEmail(emailT, usersDB);
  // if user exists return with a 400
  if (isCurrentUser) {
    return res.status(400).send('400: Already Exists');
  }

  // create a hashedPassword
  const hashedPassword = bcrypt.hashSync(passwordT, 10);

  // add new userID to session
  newUser(id, nameT, emailT, hashedPassword, usersDB);
  req.session.userID = userID;
  res.redirect("urls");
});

app.get('/login', (req, res) => {
  // get login page/form
  const templateVars = { user: null };
  res.render('login', templateVars);
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // check if email or password are empty strings

  // trim password and email
  // avoid duplicated and getting around check
  const emailT = email.trim();
  const passwordT = password.trim();

  if (emailT === '' || passwordT === '') {
    return res.status(400).send('400: Missing Email or Password ');
  }
  // get users from database
  const usersDB = users;


  // check if is a current user
  const isCurrentUser = findUserByEmail(emailT, usersDB);
  // if no user found send 403 and message too register
  if (!isCurrentUser) {
    return res.status(403).send('403: No User Found Please Register');
  }

  // Authenticale user returns user id
  const isAuthenticated = authenticateByPassword(emailT, passwordT, usersDB);
  // if password returns false 403 response
  if (!isAuthenticated) {
    return res.status(403).send('403: Password Does Not Match');
  }

  // add id to to session for valid user
  const userID = isAuthenticated;
  req.session.userID = userID;

  // redirect to urls
  res.redirect("urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
