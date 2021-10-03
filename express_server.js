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

/**
 * 400 Error Route
 * GET /400
 */
let statusCodeError = {};
app.get('/400', (req, res) => {
  let templateVars = { 
    user: null ,
    statusCodeError
  };
  res.render('400', templateVars);
});


/**
 * 401 Error Route
 * GET /401
 */
app.get('/401', (req, res) => {
  let templateVars = { 
    user: null ,
    statusCodeError
  };
  res.render('401', templateVars);
});

/**
 * 403 Error Route
 * GET /403
 */
app.get('/403', (req, res) => {
  let templateVars = { 
    user: null ,
    statusCodeError
  };
  res.render('403', templateVars);
});



/**
 * Home route
 * GET /
 * Redirects to GET /login or GET /urls
 */
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
    statusCodeError = {'401': 'Unauthorised_Access'};
    return res.status(401).redirect('401');
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



/**
 * Create new short url
 * POST /urls
 * Redirect to GET /urls
 */
app.post("/urls", (req, res) => {
  // get user id from cookie
  const userId = req.session["userID"];
  if (!userId) {
    statusCodeError = {'401': 'Unauthorised_Access'};
    return res.status(401).redirect('401');
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

  res.redirect(`/urls/${shortURLId}`);
});


/**
 * Show url
 * GET /u/:id
 * Retrieves long url from database
 * Redirects to long url website
 */
app.get("/u/:shortURL", (req, res) => {
  // receives a shoten url from an anonymous user
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


/**
 * Display create new user form 
 * GET /urls/new
 */
app.get("/urls/new", (req, res) => {
  // check if logged in and exit if not logged in
  const userId = req.session["userID"];
  if (!userId) {
    statusCodeError = {'401': 'Unauthorised_Access'};
    return res.status(401).redirect('/401');
  }
  const user = users[userId];
  const templateVars = { user: user };
  // show the create new URL screen
  res.render("urls_new", templateVars);
});

/**
 * Display urls created by authenticated user
 * GET/urls/:id
 */
app.get("/urls/:shortURL", (req, res) => {
  // get user id from session
  const userId = req.session["userID"];
  // if no userID redirect to login
  if (!userId) {
    statusCodeError = {'401': 'Unauthorised_Access'};
    return res.status(401).redirect('/401');
  }
  // 
  // if (check if belongs) {
  //   statusCodeError = {'401': 'Unauthorised Access'};
  //   return res.status(401).redirect('401');
  // }
 
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


/**
 * Create new short URL
 * POST/url/:id
 * Redirects tor GET/urls
 */
app.post("/urls/:id", (req, res) => {
  // get userID from session 
  const userId = req.session["userID"];
  // if customer not logged in redirect to user screen
  if (!userId) {
    statusCodeError = {'401': 'Unauthorised_Access'};
    return res.status(401).redirect('/401');
  }
  const shortURLId = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURLId].longURL = longURL;
  urlDatabase[shortURLId].createdAt = moment().format('MMMM Do YYYY'),
  res.redirect("/urls");
});



/**
 * Delete short url from database
 * POST/urls/:id/delete
 * Redirects to /GET/urls
 */
app.post("/urls/:shortURL/delete", (req, res) => {
  // check if user id and logged ing
  const userId = req.session["userID"];
  if (!userId) {
    statusCodeError = {'401': 'Unauthorised_Access'};
    return res.status(401).redirect('/401');
  }
  // if logged in get use provided 
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});



/**
 * Logout
 * POST /logout
 * Clears session values
 * Redirects to root /GET/
 */
app.post("/logout", (req, res) => {
  // set session value to null
  req.session = null;
  res.redirect("/");
});


/**
 * Register 
 * GET /register
 * Shows registration screen
 */
app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});


/**
 * Register 
 * POST /register
 * Redirects GET/urls 
 */
app.post("/register", (req, res) => {
  // generate a new ID for user
  const id = userId();
  const userID = id;
  // get data from form
  const { name, email, password } = req.body;
  // trim password and email
  // avoid duplicated and getting around check
  const nameT = name.trim();
  const emailT = email.trim();
  const passwordT = password.trim();


  // check for emptry strings in  email or password
  if (emailT === '' || passwordT === '' || nameT ==='') {
    statusCodeError = {'400': 'Missing_Email_or_Password'};
    return res.status(400).redirect('400');
  }

  // check if is a current user
  const usersDB = users;
  const isCurrentUser = findUserByEmail(emailT, usersDB);
  // if user exists return with a 400
  if (isCurrentUser) {
    // return res.status(400).send('400: Already Exists');
    statusCodeError = {'400': 'User_Already_Exists'};
    return res.status(400).redirect('400');
  }
  // create a hashedPassword
  const hashedPassword = bcrypt.hashSync(passwordT, 10);

  // add new userID to session
  newUser(id, nameT, emailT, hashedPassword, usersDB);
  req.session.userID = userID;
  return res.redirect("urls");
});


/**
 * Login 
 * GET /login
 * Renders the login form
 */
app.get('/login', (req, res) => {
  // get login page/form
  const templateVars = { user: null };
  res.render('login', templateVars);
});


/**
 * Login 
 * POST /login
 * Redirects to GET /urls
 */
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // check if email or password are empty strings

  // trim password and email
  // avoid duplicated and getting around check
  const emailT = email.trim();
  const passwordT = password.trim();

  if (emailT === '' || passwordT === '') {
    statusCodeError = {'400': 'Missing_Email_or_Password'}
    return res.status(400).redirect('400');
  }
  // get users from database
  const usersDB = users;


  // check if is a current user
  const isCurrentUser = findUserByEmail(emailT, usersDB);
  // if no user found send 403 and message too register
  if (!isCurrentUser) {
    statusCodeError = {'403': 'Not_User_Found'};
    return res.status(403).redirect('403');
  }

  // Authenticale user returns user id
  const isAuthenticated = authenticateByPassword(emailT, passwordT, usersDB);
  // if password returns false 403 response
  if (!isAuthenticated) {
    statusCodeError = {'403': 'Password_Does_Not_Match'};
    return res.status(403).redirect('403');
  }
  // add id to to session for valid user
  const userID = isAuthenticated;
  req.session.userID = userID;

  // redirect to urls
  res.redirect("urls");
});

/**
 * Create server
 * listens on PORT
 */
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
