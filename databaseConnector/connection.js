const mysql2 = require("mysql2");

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'newlirioemployeedb'
});
db.promise();
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

module.exports = db;
