const express = require("express");
const app = express();
const PORT = 8080;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


app.use(morgan('short'));

const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const generateRandomString = (setStringLength = 6) => {
  const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = setStringLength;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * characters.length);
    randomString += characters[randomNum];
  }
  return randomString;
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
  const templateVars = { urls: urlDatabase}
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  const shortURLId = generateRandomString();
  // urlDatabase[shortURLId] = `http://${req.body.longURL}`;
  // const longURL = req.body.longURL
  // urlDatabase[shortURLId] = longURL;
  urlDatabase[shortURLId] = req.body.longURL;
  res.redirect("/urls");  
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  // console.log(urlDatabase[req.params.shortURL]);
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const shortURLId = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURLId] = req.body.longURL;
  console.log('shortURLID',shortURLId,'NewLongURL',longURL )
  res.redirect("/urls")
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});


// curl -X POST -i localhost:8080/login -d "username=vanillaice"
app.post("/login", (req, res) => {
  // Cookies that have not been signed
  console.log('body',req.body.username)
 
  res.cookie('name', req.body.username)

  res.redirect("/urls");
});





app.get("/urls.json",(req, res)=>{
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
