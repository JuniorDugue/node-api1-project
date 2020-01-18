// implement your API here

const express = require('express');
// bring express into the project

const dataB = require('./data/db.js');

const server = express();
// create a "server" object


server.use(express.json()); //teaches express how to parse JSON from body //.POST
//^JSON Middleware

// find [x],
// findById [x],
// insert,
// update,
// remove,

server.get('/', (req, res) => {
    res.send('info from body');
});

// //-*-*-*-* GET REQUEST  -*-*-*-*
// A handler for GET '/'.

// One of the methods is "find()". By default, db.find() returns all hubs in the
// DB.

// Each of the DB methods returns a Promise. We specify what to do when a
// Promise "resolves" by passing a callback in the .then() method on the Promise
// object. We specify what to do when a Promise "rejects" (if an exception is
// thrown, or a Reject happens for any other reason) by passing a callback in
// the .catch() method on the Promise object.

server.get('/api/users', (req, res) => {
    dataB
        .find()
        .then(users => res.status(200).json(users)) //200 means good
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'The user information could not be retrieved.',
            });
        });
});

// -*-*-*-* POST REQUEST  -*-*-*-*

// If the body is in the right format (i.e. contains the right field/parameter
// names, such as {"name":"value"}), the object that is created by
// express.json() parsing the request body can be passed straight to the DB
// method to add a record to the DB: db.add().

server.post('/api/users', (req, res) => {
    //read info sent by client
    const userInfo = req.body;

    const { name, bio } = req.body;
    if (name && bio) {
        dataB
            .insert(userInfo)
            .then(Objresult => {
                res.json(Objresult);
                res.status(201);
            })
            .catch(err => {
                res.render(error);
                res.render.status(500);
            });
        // res.add('Sending info from body', userInfo);
    } else {
        res.status(400).json({
            errorMessage: 'Please provide name and bio for the user.',
        });
    }
}); // (/api/users) is a resource

// //-*-*-*-* GET REQUEST  -*-*-*-*
server.get('/api/users/:id', (req, res) => {
    const { hubsID } = req.params.id;

    dataB
        .findById(hubsID)
        .then(user => {
            console.log('user', user);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    error: 'The user with the specified ID does not exist.',
                });
            }
            // else {
            //     res.status(400).json({
            //         errorMessage: 'Please provide name and bio for the user.',
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'The user information could not be retrieved.',
            });
        });
});

// //-*-*-*-* DELETE REQUEST  -*-*-*-*

// This handler works for DELETE '/hubs/:id'.
//
// Notice the "parameter" in the url... preceding a URL "part" name with a colon
// designates it as a "parameter". You can access all parameters that are
// identified in the URL using the req.params property (it's an object). 

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    dataB
        .remove(id)
        .then(deleted => {
            console.log('deleted', deleted);
            if (deleted) {
                res.status(204).json(deleted);
            } //200 means good
            else {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist.',
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'The user could not be removed',
            });
        });
});

//-*-*-*-* UPDATE REQUEST  -*-*-*-*

// A handler for PUT '/hubs/:id'. This is for updating a record.

// This is like a combination of DELETE with an "id" parameter (to indicate
// which record to delet), and POST with data in the body. 
//
// In this handler, PUT is used to update an existing record. the "id" parameter
// identifies the record, and the body of the PUT request contains the new data
// we want to store in the database.
//
// Using PUT to mean "update" is arbitrary - we can make our Express server
// update a record in response to ANY HTTP method/route. PUT is the standard way
// of doing it, however, and is what developers using your API will expect.
//

server.put('/api/users/:id', (req, res) => {
    const { name, bio } = req.body;
    const { id } = req.params;
    if (!name && !bio) {
        res.status(400).json({
            errorMessage: 'Please provide name and bio for the user.',
        });
    }

    dataB
        .update(id, { name, bio })
        .then(updated => {
            if (updated) {
                dataB
                    .findById(id)
                    .then(user => res.status(200).json(user)) //200 means good
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error:
                                'The user information could not be modified.',
                        });
                    });
            } else {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist.',
                });
            }
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'The user information could not be modified.',
            });
        });
});

const port = 5000;
server.listen(port, () => console.log('api running'));