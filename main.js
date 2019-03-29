const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

let mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'contacts'
});

mysqlConnection.connect( (err) => {
    if(!err)
        console.log("Connected");
    else 
        console.log("not Connected");
});

// GET ALL CONTACTS
app.get('/contact/get', (req, res) => {
    
    let query = 'SELECT * FROM contactlist ORDER BY id';

    mysqlConnection.query( query, (err, rows, fields) => {
        if(!err)
            res.json(rows);
        else
            console.log(err);
    });

});

// INSERT OR UPDATE OF CONTACTS 
app.post('/contact/insertupdate', (req, res) => {

    let process = req.body.process_value;

    let contact_id = req.body.id;
    let contact_name = req.body.name;
    let contact_email = req.body.email;
    let contact_number = req.body.number;

    if ( process == "Insert" ) {

        let query = "INSERT INTO contactlist(name, email, number) VALUES(?,?,?)";

        let output = {
            message: "Data has been added.",
            status: "Success"
        };

        mysqlConnection.query( query, [contact_name, contact_email, contact_number], (err, rows, fields) => {
            if(!err)
                res.json(output);
        });

    } else {

        let paramArray = [
            contact_name, contact_email, contact_number, contact_id
        ];

        let query = "UPDATE contactlist SET name = ?, email = ?, number = ? WHERE id = ?";
        let output = {
            message: "Data has been updated.",
            status: "Success"
        };

        mysqlConnection.query( query, paramArray, (err, rows, fields) => {
            if(!err)
                res.json(output);
        });

    }

});

// DELETE OF CONTACT
app.delete('/contact/delete/:id', (req, res) => {

    let id = req.params.id;
    let query = "DELETE FROM contactlist WHERE id = ?";

    mysqlConnection.query( query , [id], (err, rows, fields) => {

        let output = {
            message: "Data has been deleted.",
            status: "Success"
        }

        if(!err)
            res.json(output);

    });

});

app.listen(3000, () => {
    console.log("Express server is running");
});