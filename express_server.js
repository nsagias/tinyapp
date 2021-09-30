const express = require("express");
const app = express();
const PORT = 8080;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const uuid = require("uuid");
const bodyParser = require("body-parser");

app.use(morgan('short'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const generateRandomString = () => {
  return uuid.v4().substring(0,6)
};

const userId = () => {
  return uuid.v4().substring(0,8)
};



const users = { 
  "815bd08a": {
    id: "'815bd08a", 
    email: "red1@example.com", 
    password: "red"
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
}



let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello",(req, res)=>{
  res.send("<html><body>Hello <b>World</b></body></html>")
});

app.get("/urls",(req, res)=>{
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { 
    user: user,
    urls: urlDatabase
  };
  console.log('templateVars:',templateVars);
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
  const templateVars = { user: user};
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
  console.log('shortURLID',shortURLId,'NewLongURL',longURL);
  res.redirect("/urls")
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});


app.post("/login", (req, res) => {
  console.log('body',req.body.user_id);
  res.cookie('user_id', req.body.user_id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  console.log('body',req.body.user_id);
  res.clearCookie('user_id')
  res.redirect("/urls");
});


app.get("/register", (req, res) => {
  const templateVars = {user: null};
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  // const templateVars = {user_id: null};
  console.log('register body form: ', req.body);
  const id = userId();
  const user_id = id;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (email ==='' || password ==='') {
    return res.status(400).send('400: Missing Email or Password ');
  }
 
  for (let user in users) {
    if (users[user].email === email) {  
      return res.status(400).send('400: Already Exists');
    } 
  }
  
  users[id] = {
    id:  id,
    name: name,
    email: email,
    password: password
  }

  console.log(users)
  res.cookie('user_id', user_id);
  // res.send('ok');
  res.redirect("urls");
});






app.get("/urls.json",(req, res)=>{
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
