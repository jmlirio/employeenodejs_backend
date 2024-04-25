const {router, bcrypt ,authenticateToken ,jsonwebtoken} =  require("./importModule");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('./databaseConnector/connection');
require('dotenv').config();

  router.post("/Positions/register", async (req, res) => {
    try {
      const {PositionID, PositionName} = req.body;
  
      const insertPositionsQuery =
        "INSERT INTO Positions (PositionID, PositionName) VALUES (?, ?)";
      await db
        .promise()
        .execute(insertPositionsQuery, [PositionID, PositionName]);
  
      res.status(201).json({ message: "Positions registered successfully" });
    } catch (error) {
      console.error("Error registering dept:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

router.get('/Positions/:id',authenticateToken, (req, res) => {
    let PositionID = req.params.id;

    if (!PositionID) {
        return res.status(400).send({error: true, message :'Please provide PositionID'});
    }
    try{
        db.query('SELECT * FROM Positions WHERE PositionID = ?', PositionID, (err, result) => {
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


router.get('/Positions', authenticateToken,(req, res) => {

    try {
        db.query('SELECT * FROM Positions',(err, result) => {

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



// router.put('/Positions/:id', authenticateToken, async (req,  res) => {
//     let EmployeeID = req.params.id;

//     const{PositionID, PositionName} = req.body;

//     if (!PositionID || !PositionName) {
//         return res.status(400).send({error: user,message:'please provide position code'});
//     } 

//     try { 
//         db.query('UPDATE Positions SET PositionID = ?, PositionName = ?',[PositionID, PositionName],(err,result, fields) => {
//         if (err){
//             console.error('error updating:', err);
//             res.status(500).json({message:'internall server error'});
//         }else {
//             res.status(200).json(result);
//         }
//     });

//     } catch (error) {
//         console.error('error loading user', error);
//         res.status(500).json({ error: 'internnal server error' });
//     }

// });

router.put('/Positions/:id', authenticateToken, async (req, res) => {
    try {
      const positionID = req.params.id;
      const { PositionName } = req.body;
  
      if (!positionID || !PositionName) {
        return res.status(400).json({ message: 'Please provide position ID and position name' });
      }
  
      db.query('UPDATE Positions SET PositionName = ? WHERE PositionID = ?', [PositionName, positionID], (err, result) => {
        if (err) {
          console.error('Error updating position:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Position not found' });
        }
  
        res.status(200).json({ message: 'Position updated successfully' });
      });
    } catch (error) {
      console.error('Error updating position:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.delete("/Positions/:id", authenticateToken, (req, res) => {
    try {
      const positionID = req.params.id;
  
      if (!positionID) {
        return res.status(400).json({ error: true, message: 'Please provide position ID' });
      }
  
      db.query('DELETE FROM Positions WHERE PositionID = ?', [positionID], (err, result) => {
        if (err) {
          console.error('Error deleting position:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Position not found' });
        }
  
        res.status(200).json({ message: 'Position deleted successfully' });
      });
    } catch (error) {
      console.error('Error deleting position:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router