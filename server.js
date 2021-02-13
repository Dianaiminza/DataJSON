var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var db = new sqlite3.Database('./database/cat.db');


db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');

app.get('/', function(req,res){
  res.send("<h3> Hi there, You are going to perform CRUD operations.............[CREATE] Please enter 'http://localhost:3000/add/(id number)/(name)' to add a cat to the database.........................[READ] 'http://localhost:3000/view/(id number)' to view a cat.........................[UPDATE] 'http://localhost:3000/update/(id number)/(new name)' to update a cat.....................[DELETE] 'http://localhost:3000/del/(id number)' to delete a cat..............................Before closing this window, kindly enter 'http://localhost:3000/close' to close the database connection <h3>");
});


// CREATE
app.get('/add/:id/:name/:action', function(req,res){
   db.serialize(()=>{
      let insert = 'INSERT INTO cat (id, name, action) VALUES (?,?,?)';  
      db.run('INSERT INTO cat(id,name,action) VALUES($id, $name,$action)', [req.params.id, req.params.name, req.params.action], function(err) {
      db.run(insert, [4, "Praveen","sleeping" ]);
      db.run(insert, [5, "Mohim", "eating"]);
      db.run(insert, [6, "Pinky","dancing"]);
      db.run(insert, [7, "Moh","walking"]);
      db.run(insert, [8, "Coco","growling"]);
      db.run(insert, [9, "Fifi","eating"]);
      db.run(insert, [1, "Taj","sleeping"]);
      db.run(insert, [2, "Leo","jumping"]);
      db.run(insert, [3, "Juma","hissing"]);
      db.run(insert, [4, "Muna","hissing"]);
       
        if (err) {
       //   return console.log(err.message);
        }
        console.log("New cat has been added");
        res.send("New cat has been added into the database with id = "+req.params.id+ " ,name = "+req.params.name+" and action="+req.params.action);
      });
  
    });
  
  });


// READ
app.get('/cat/:id', function(req,res){
  var params = [req.params.id]
    db.get(`SELECT * FROM cat where id = ?`, [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(row);
      });
});
app.get("/cat", (req, res, next) => {
    db.all("SELECT * FROM cat", [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json({rows});
      });
});

//UPDATE
app.get('/update/:id/:name', function(req,res){
  db.serialize(()=>{
    db.run('UPDATE cat SET name = ? WHERE id = ?', [req.params.name,req.params.id], function(err){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("Entry updated successfully");
      console.log("Entry updated successfully");
    });
  });
});
// DELETE
app.get('/del/:id', function(req,res){
  db.serialize(()=>{
    db.run('DELETE FROM cat WHERE id = ?', req.params.id, function(err,rows) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entry deleted");
      console.log("Entry deleted");
    });
  });

});




// Closing the database connection.
app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });

});



server.listen(3000, function(){
  console.log("server is listening on port: 3000");
});