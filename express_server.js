const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString(setStringLength = 6) {
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

const urlDatabase = {
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
  console.log(req.params)
  const templateVars = { urls: urlDatabase}
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console // Respond with 'Ok' (we will replace this)
  res.send("Ok");         
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  // console.log(urlDatabase[req.params.shortURL]);
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});


app.get("/urls.json",(req, res)=>{
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
