// implement your API here

const db = require('./data/db.js');
const express = require('express');
const cors = require('cors');

const server = express();

server.listen(4000, () => {
    console.log('*** listening on port 4000 ***');
});

//global middleware
server.use(express.json())
server.use(cors());

//CRUD
// C - create - POST  
// R - read - GET
// U - update - PUT
// D - delete (destroy) - DELETE

//**************** Endpoints ****************//
server.get('/', (req, res) => {
    res.send('Hello World');
  });
  
  // Create new user- C //
  server.post('/api/users', (req, res) => {
    const user = req.body;
  
    if (!user.name || !user.bio) {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user."
      })
    } else {
      db.insert(user).then(user => {
        db.findById(user.id).then(userObj => {
          res.status(201).json({
            success: true,
            user: userObj
          });
        })
      }).catch(err => {
        res.status(500).json({
          errorMessage: "There was an error while saving the user to the database"
        });
      })
    }
  });
  
  // Get all users- R //
  server.get('/api/users', (req, res) => {
    db.find().then(users => {
      res.status(200).json(users);
    }).catch(err => {
      res.statue(500).json({
        errorMessage: "The users information could not be retrieved."
      })
    })
  });
  
  // Get user by id- R //
  server.get('/api/users/:id', (req, res) => {
    const {
      id
    } = req.params;
  
    db.findById(id).then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        })
      }
    }).catch(err => {
      res.status(500).json({
        errorMessage: "The user information could not be retrieved."
      })
    })
  });
  
  // Delete user- D //
  server.delete('/api/users/:id', (req, res) => {
    const {
      id
    } = req.params;
  
    db.remove(id).then(user => {
      if (user) {
        db.findById(user.id).then(userObj => {
          res.status(200).json({
            success: true,
            user: userObj
          })
        })
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        })
      }
    }).catch(err => {
      res.status(500).json({
        errorMessage: "The user could not be removed"
      })
    })
  });
  
  // Edit user- U //
  server.put('/api/users/:id', (req, res) => {
    const {
      id
    } = req.params;
  
    if (!req.body.name || !req.body.bio) {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user."
      })
    } else {
      db.update(id, req.body).then(user => {
        if (user) {
          db.findById(id).then(userObj => {
            res.status(201).json({
              success: true,
              user: userObj
            })
          }).catch(err => {
            res.status(400).json({
              error: err
            })
          })
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          })
        }
      }).catch(err => {
        res.status(500).json({
          errorMessage: "The user information could not be modified."
        })
      })
    }
  });
  //**************** End of Endpoints ****************//
  
 