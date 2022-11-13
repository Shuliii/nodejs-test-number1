const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const Pool = require("mysql/lib/Pool");
const res = require("express/lib/response");

const app = express();
const port = process.env.PORT || 5000;

//DEFAULT OPTION
app.use(fileUpload());

// Static files
app.use(express.static("public"));
app.use(express.static("upload"));

// TEMPLATING ENGINE

// app.engine("hbs", exphbs({ extname: ".hbs" }));
// app.set("view engine", "hbs");

const handlebars = exphbs.create({ extname: ".hbs" });
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

// Connection Pool
const connection = mysql.createConnection({
  host: "eu-cdbr-west-03.cleardb.net",
  user: "be77dd94a32598",
  password: "0afe16fa",
  database: "heroku_4cf4933a51b66a6",
});

app.get("", (req, res) => {
  connection.query('SELECT * FROM userprofile WHERE id = "1"', (err, rows) => {
    if (!err) {
      res.render("index", { rows });
    }
  });
});

app.post("", (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded");
  }

  // same of the input is sampleFile

  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + "/upload/" + sampleFile.name;

  //use mv() to place file on the server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    // res.send("File uploaded!");

    connection.query(
      'UPDATE userprofile SET Profile_Image = ? where id = "1"',
      [sampleFile.name],
      (err, rows) => {
        if (!err) {
          res.redirect("/");
        } else {
          console.log(err);
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
