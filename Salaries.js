const {router, bcrypt ,authenticateToken ,jsonwebtoken} =  require("./importModule");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('./databaseConnector/connection');
require('dotenv').config();

router.post("/Salaries/register", async (req, res) => {
    try {
      const {SalaryID, EmployeeID, SalaryAmount} = req.body;
  
      const inserSalariesQuery =
        "INSERT INTO Salaries (SalaryID, EmployeeID, SalaryAmount) VALUES (?, ?, ?)";
      await db
        .promise()
        .execute(inserSalariesQuery, [SalaryID, EmployeeID, SalaryAmount]);
  
      res.status(201).json({ message: "salary registered successfully" });
    } catch (error) {
      console.error("Error registering salari:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get('/Salaries/:id',authenticateToken, (req, res) => {
    let SalaryID = req.params.id;

    if (!SalaryID) {
        return res.status(400).send({error: true, message :'Please provide EmployeeID'});
    }
    try{
        db.query('SELECT * FROM Salaries WHERE SalaryID = ?', SalaryID, (err, result) => {
          if(err){
            console.error('error fetching items:', err);
            res.status(500).json({ message: 'Internal server error'})
          } else {
            res.status(200).json(result);
          }  
        });

    } catch (errror){

        console.error('Error loadng user:', error);
        res.status(500).json({error: 'interrnal server error'})
    }
});


router.get('/Salaries', authenticateToken,(req, res) => {

    try {
        db.query('SELECT * FROM Salaries',(err, result) => {

            if(err) {
                console.error('error fetching items:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }else{
                res.status(200).json({result});
            }
        });

    } catch (error) {
        console.error('Error loading users', error);
        res.status(200).json({ error: 'Internal Server Error' });
    }
});



router.put('/Salaries/:id', authenticateToken, async (req,  res) => {
    let SalaryID = req.params.id;

    const{EmployeeID, SalaryAmount} = req.body;

    if (!EmployeeID || !SalaryAmount) {
        return res.status(400).send({message:'please provide role code and role name'});
    } 

    try { 
        db.query('UPDATE Salaries SET EmployeeID = ?, SalaryAmount = ? WHERE SalaryID = ?',[EmployeeID, SalaryAmount, SalaryID],(err,result, fields) => {
        if (err){
            console.error('error updating:', err);
            res.status(500).json({message:'internall server error'});
        }else {
            res.status(200).json(result);
        }
    });

    } catch (error) {
        console.error('error loading user', error);
        res.status(500).json({ error: 'internnal server error' });
    }

});


router.delete("/Salaries/:id", authenticateToken, (req, res) => {
    try {
      const SalaryID = req.params.id;
  
      if (!SalaryID) {
        return res.status(400).json({ error: true, message: 'Please provide SalaryID' });
      }
  
      db.query('DELETE FROM Salaries WHERE SalaryID = ?', [SalaryID], (err, result) => {
        console.log('Result:', result);
        if (err) {
          console.error('Error deleting salary:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Salary not found' });
        }
  
        res.status(200).json({ message: 'Salary deleted successfully' });
      });
    } catch (error) {
      console.error('Error deleting salary:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router