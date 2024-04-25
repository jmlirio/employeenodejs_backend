const {router, bcrypt ,authenticateToken ,jsonwebtoken} =  require("./importModule");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('./databaseConnector/connection');
require('dotenv').config();

router.post("/Departments/register", async (req, res) => {
    try {
      const {DepartmentID, DepartmentName} = req.body;
  
      const insertDepartmentQuery =
        "INSERT INTO Departments (DepartmentID, DepartmentName) VALUES (?, ?)";
      await db
        .promise()
        .execute(insertDepartmentQuery, [DepartmentID, DepartmentName]);
  
      res.status(201).json({ message: "department registered successfully" });
    } catch (error) {
      console.error("Error registering dept:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


router.get('/Departments/:id',authenticateToken, (req, res) => {
    let DepartmentID = req.params.id;

    if (!DepartmentID) {
        return res.status(400).send({error: true, message :'Please provide DepartmentID'});
    }
    try{
        db.query('SELECT * FROM Departments WHERE DepartmentID = ?', DepartmentID, (err, result) => {
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



router.get('/Departments', authenticateToken,(req, res) => {

  try {
      
      db.query('SELECT * FROM Departments',(err, result) => {

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





router.put('/Departments/:id', authenticateToken, async (req, res) => {
    try {
      const DepartmentID = req.params.id;
      const { DepartmentName } = req.body;
  
      if (!DepartmentID || !DepartmentName) {
        return res.status(400).json({ message: 'Please provide department ID and department name' });
      }
  
      db.query('UPDATE Departments SET DepartmentName = ? WHERE DepartmentID = ?', [DepartmentName, DepartmentID], (err, result) => {
        if (err) {
          console.error('Error updating department:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Department not found' });
        }
  
        res.status(200).json({ message: 'Department updated successfully' });
      });
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.delete("/Departments/:id", authenticateToken, (req, res) => {
    try {
      const DepartmentID = req.params.id;
  
      if (!DepartmentID) {
        return res.status(400).json({ error: true, message: 'Please provide DepartmentID' });
      }
  
      db.query('DELETE FROM Departments WHERE DepartmentID = ?', [DepartmentID], (err, result) => {
        if (err) {
          console.error('Error deleting department:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Department not found' });
        }
  
        res.status(200).json({ message: 'Department deleted successfully' });
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router