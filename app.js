const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs-crud",
});

// Getting All Records
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    connection.query("SELECT * from crud", (err, rows) => {
      connection.release(); // It will return the connection to pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    });
  });
});

// Getting a record by ID
app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    connection.query(
      "SELECT * from crud WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // It will return the connection to pool

        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
      }
    );
  });
});

// Deleting a records
app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    connection.query(
      "DELETE from crud WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // It will return the connection to pool

        if (!err) {
          res.send(`Record ID: ${[req.params.id]} has been removed`);
        } else {
          console.log(err);
        }
      }
    );
  });
});

// Adding a record
app.post("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    const params = req.body;

    connection.query("INSERT INTO crud SET ?", params, (err, rows) => {
      connection.release(); // It will return the connection to pool

      if (!err) {
        res.send(`Record with the name: ${params.name} has been added.`);
      } else {
        console.log(err);
      }
    });
    console.log(req.body);
  });
});

//Updating a record
app.put("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    const { id, name, tagline, description, image } = req.body;

    connection.query(
      "UPDATE crud SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?",
      [name, tagline, description, image, id],
      (err, rows) => {
        connection.release(); // It will return the connection to pool

        if (!err) {
          res.send(`Record with the name: ${name} has been updated.`);
        } else {
          console.log(err);
        }
      }
    );
    console.log(req.body);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
