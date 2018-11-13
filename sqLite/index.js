const express = require('express');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./my-db.sqlite', (err) => {
    console.log(err);
});


const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

/**
 * createTable
 */
function createTable() {

    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS Users (Name TEXT, Age INTEGER)");
        console.log("Table created");

    });

}

/**
 * insert data
 * @param name
 * @param age
 */
function insertData(name, age) {
    db.serialize(function () {
        db.run(
            'INSERT INTO Users (Name,Age) VALUES (?,?)',
            [name,age]);

    })
}

/**
 * update data
 * @param name
 * @param age
 */
function updateData(name, age) {
    db.serialize(function () {
        db.run(
            `UPDATE Users SET Name = ? WHERE Age = ?`,
            [name, age]
        )
    })
}

/**
 * del data
 * @param name
 * @param age
 */
function deleteData(age) {
    db.run(
        `DELETE FROM Users WHERE Age = ?`,
        [age]
    )

}



/**Thu Aug 02 2018
 *
 */
app.get('/getAll', (req, res, next) => {
    db.serialize(function () {
        db.all("SELECT * from Users", function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(rows);
                return res.send({status:true,data:rows})
            }
        });
    });
});
/**
 *
 */
app.post('/', (req, res, next) => {
    let choice = req.body.flag;let result='';
    db.serialize(function () {
        if (choice === '0') {
            insertData(req.body.name, req.body.age);
            return res.send({status: true, message: 'data inserted'})
        } else if (choice === '1') {
            updateData('alvin', req.body.age);
            return res.send({status: true, message: 'data updated'})
        } else {
            deleteData(req.body.age);
            return res.send({status: true, message: 'data deleted'})
        }

    });

});
const server = app.listen('5200', function () {
    console.log('application started at 5200');
});
