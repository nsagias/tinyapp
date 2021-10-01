const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const {
  generateRandomString,
  userId,
  findUserByEmail,
  newUser,
  authenticateByPassword,
  urlsForUser
} = require('./helperFunctions/userManagement');

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
    email: "red@example.com",
    password: bcrypt.hashSync('red', 10)
  },
  "ec3bdf7a": {
    id: "ec3bdf7a",
    email: "green@example.com",
    password: bcrypt.hashSync('green', 10)
  },
  "1f1ffea1": {
    id: "1f1ffea1",
    email: "blue@example.com",
    password: bcrypt.hashSync('blue', 10)
  }
};

let urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "1f1ffea1",  
  },
  "9sm5xk": {
    longURL: "http://www.google.com",
    userID: "1f1ffea1", 
  },
  "9sm511": {
    longURL: "http://www.bingo.com",
    userID: "815bd08a",
  },
  "c2k511": {
    longURL: "http://www.yahoo.com",
    userID: "815bd08a",
  }
};

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

app.get("/urls", (req, res) => {
  const userId = req.session["userID"];
  if (!userId ) {
		return res.redirect('login');
	}
  const user = users[userId];
  let userURLs =  urlsForUser(userId, urlDatabase); 
  // console.log(userURLs);
  const templateVars = {
    user: user,
    urls: userURLs
  };
  // console.log('templateVars:', templateVars);
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  	// get user id from cookie
  const userId = req.session["userID"];
	if (!userId ) {
		return res.redirect('login');
	}
	// creat new short URL
  const shortURLId = generateRandomString();


	// console.log(userId);
  const user = users[userId];
	let newURL = {
		longURL : req.body.longURL,
		userID : user.id
	}
  console.log(newURL)
  urlDatabase[shortURLId] = newURL;
	// console.log(urlDatabase);
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  console.log(urlDatabase[req.params.shortURL])
  console.log(urlDatabase[req.params.shortURL].longURL)
  console.log(urlDatabase)
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // console.log(longURL.longURL)
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session["userID"];
	if (!userId ) {
		return res.redirect('login');
	}
  const user = users[userId];
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session["userID"];
	if (!userId ) {
		res.redirect('login');
	}
  const user = users[userId];
  const templateVars = {
    user: user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const userId = req.session["userID"];
	if (!userId ) {
		return res.redirect('login');
	}
  
  const shortURLId = req.params.id;
  const longURL = req.body.longURL;
  // console.log('LONGURL:',longURL)

  urlDatabase[shortURLId].longURL =  longURL;
  // console.log('URLDATABASE: ',urlDatabase)
  // console.log('shortURLID', shortURLId, 'NewLongURL', longURL);
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session["userID"];
	if (!userId ) {
		returnres.redirect('login');
	}
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  // console.log('body', req.body.userID);
  req.session = null
  res.redirect("/urls");
});


app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});


app.post("/register", (req, res) => {
  // const templateVars = {userID: null};
  console.log('register body form: ', req.body);
  const id = userId();
  const userID = id;
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
   
  // hashedPassword
  const hashedPassword = bcrypt.hashSync(password, 10);

  // add new user to db
  newUser(id, name, email, hashedPassword, usersDB);
  console.log(users)
  // console.log(users);
  req.session.userDB = userID;
  // res.send('ok');
  res.redirect("urls");
});

app.get('/login', (req, res) => {
  const templateVars = { user: null };
  // console.log('here');
  res.render('login', templateVars);
});



app.post("/login", (req, res) => {
  // console.log('register body form: ', req.body);

  // get email and password from form
  const { email, password } = req.body;
  // console.log(email);
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
  const userID = isAuthenticated;
  req.session.userID = userID;

  // redirect to urls
  res.redirect("urls");
});




app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
