// const {router, bcrypt, authenticateToken ,jsonwebtoken} =  require("../../../importModule");
const {router, bcrypt ,authenticateToken ,jsonwebtoken} =  require("../../../importModule");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('../../../databaseConnector/connection');
require('dotenv').config();
  router.post("/Addresses/register", async (req, res) => {
    try {
      const {AddressID, EmployeeID, AddressLine1, City} = req.body;
  
      const insertAddressesQuery =
        "INSERT INTO Addresses (AddressID, EmployeeID, AddressLine1, City) VALUES (?, ?, ?, ?)";
      await db
        .promise()
        .execute(insertAddressesQuery, [AddressID, EmployeeID, AddressLine1, City]);
  
      res.status(201).json({ message: "Addresses registered successfully" });
    } catch (error) {
      console.error("Error registering dept:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


router.get('/Addresses/:id',authenticateToken, (req, res) => {
    let AddressID = req.params.id;

    if (!AddressID) {
        return res.status(400).send({error: true, message :'Please provide AddressID'});
    }
    try{
        db.query('SELECT * FROM Addresses WHERE AddressID = ?', AddressID, (err, result) => {
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

router.get('/Addresses', authenticateToken,(req, res) => {

    try {
        db.query('SELECT * FROM Addresses',(err, result) => {

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



router.put('/Addresses/:id', authenticateToken, async (req, res) => {
    try {
      const addressID = req.params.id;
      const { EmployeeID, AddressLine1, City } = req.body;
  
      if (!addressID || !EmployeeID || !AddressLine1 || !City) {
        return res.status(400).json({ message: 'Please provide address ID, employee ID, address line 1, and city' });
      }
  
      db.query('UPDATE Addresses SET EmployeeID = ?, AddressLine1 = ?, City = ? WHERE AddressID = ?', [EmployeeID, AddressLine1, City, addressID], (err, result) => {
        if (err) {
          console.error('Error updating address:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Address not found' });
        }
  
        res.status(200).json({ message: 'Address updated successfully' });
      });
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.delete("/Addresses/:id", authenticateToken, (req, res) => {
    try {
      const addressID = req.params.id;
  
      if (!addressID) {
        return res.status(400).json({ error: true, message: 'Please provide AddressID' });
      }
  
      db.query('DELETE FROM Addresses WHERE AddressID = ?', [addressID], (err, result) => {
        if (err) {
          console.error('Error deleting address:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Address not found' });
        }
  
        res.status(200).json({ message: 'Address deleted successfully' });
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router