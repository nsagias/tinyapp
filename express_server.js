const express = require("express");
const app = express();
const PORT = 8080;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const {
  generateRandomString,
  userId,
  findUserByEmail,
  newUser,
  authenticateByPassword
} = require('./helperFunctions/userManagement');

app.use(morgan('short'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const newUrl = (url_id, url, user_id, urlDB) => {
  return urlDB[url_id] = {
    url_id,
    url,
    user_id
  };
};


const getUrlByUserId = (userId, urlDB) => {
  let result = {};
  for (let url in urlDB) {
    if (urlDB[url].user_id === userId) {
      result[url] = urlDB[url];
    }
  }
  return result;
};

const users = {
  "815bd08a": {
    id: "815bd08a",
    email: "red1@example.com",
    password: "red",
  },
  "ec3bdf7a": {
    id: "ec3bdf7a",
    email: "green@example.com",
    password: "green"
  },
  "1f1ffea1": {
    id: "1f1ffea1",
    email: "blue@example.com",
    password: "blue"
  }
};
// stretch
// let urlDatabase2 = {
//   "b2xVn2": {
//     url_id:"b2xVn2",
//     url: "http://www.lighthouselabs.ca",
//     user_id: "1f1ffea1",
//     count: 0
//   },
//   "9sm5xk": {
//     url_id:"9sm5xk",
//     url: "http://www.google.com",
//     user_id: "1f1ffea1",
//     count: 0
//   },
//   "9sm511": {
//     url_id: "9sm511",
//     url: "http://www.bingo.com",
//     user_id: "815bd08a",
//     count: 0
//   },
//   "c2k511": {
//     url_id: "c2k511",
//     url: "http://www.yahoo.com",
//     user_id: "815bd08a",
//     count: 0
//   }
// };

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {
    user: user,
    urls: urlDatabase
  };
  console.log('templateVars:', templateVars);
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  const shortURLId = generateRandomString();
  urlDatabase[shortURLId] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {
    user: user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const shortURLId = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURLId] = req.body.longURL;
  console.log('shortURLID', shortURLId, 'NewLongURL', longURL);
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  console.log('body', req.body.user_id);
  res.clearCookie('user_id');
  res.redirect("/urls");
});


app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});


app.post("/register", (req, res) => {
  // const templateVars = {user_id: null};
  console.log('register body form: ', req.body);
  const id = userId();
  const user_id = id;
  const { name, email, password } = req.body;

  // check if email or password are empty strings
  if (email === '' || password === '') {
    return res.status(400).send('400: Missing Email or Password ');
  }

  // check if is a current user
  const usersDB = users;
  const isCurrentUser = findUserByEmail(email, usersDB);
  if (isCurrentUser) {
    return res.status(400).send('400: Already Exists');
  }

  // add new user to db
  newUser(id, name, email, password, usersDB);

  // console.log(users);
  res.cookie('user_id', user_id);
  // res.send('ok');
  res.redirect("urls");
});

app.get('/login', (req, res) => {
  const templateVars = { user: null };
  console.log('here');
  res.render('login', templateVars);
});



app.post("/login", (req, res) => {
  console.log('register body form: ', req.body);

  // get email and password from form
  const { email, password } = req.body;
  console.log(email);
  // // check if email or password are empty strings
  if (email === '' || password === '') {
    return res.status(400).send('400: Missing Email or Password ');
  }

  // get users from store
  const usersDB = users;

  // check if is a current user
  const isCurrentUser = findUserByEmail(email, usersDB);
  if (!isCurrentUser) {
    return res.status(403).send('403: No User Found Please Register');
  }

  // Authenticale user returns user.id
  const isAuthenticated = authenticateByPassword(email, password, usersDB);
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return res.status(403).send('403: Password Does Not Match');
  }

  // add id to cookies
  console.log(isAuthenticated);
  const user_id = isAuthenticated;
  res.cookie('user_id', user_id);

  // redirect to urls
  res.redirect("urls");
});




app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
