import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;


app.use(express.static(__dirname + "/public"));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});


app.post("/register", (req, res) => {
  const { name, email, password } = req.body;


  if (password.length < 8) {
    res.send("Error: Password must be at least 8 characters long.");
    return;
  }

  const newUser = { name, email, password };

 
  const filePath = __dirname + "/users.json";
  fs.readFile(filePath, "utf8", (err, data) => {
    let users = [];
    if (!err && data) {
      users = JSON.parse(data);
    }
    users.push(newUser); 
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        res.send("Error: Could not save user data.");
      } else {
        res.send(`Welcome, ${name}! Your data has been hacked.`);
      }
    });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
