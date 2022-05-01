const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Person = require('../models/person');

//Handles GET requests to /people
router.get('/', (req,res,next)=>{
    Person.find()
        .select('name age email phone')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                people: docs.map(doc=>{
                    return{
                        _id: doc._id,
                        name: doc.name,
                        age: doc.age,
                        phone: doc.phone,
                        email: doc.email,
                        request:{
                            type:'GET',
                            url: 'http://localhost:3000/people/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err});
        });
});

//Handles POST requests to /people
router.post('/', (req,res,next)=>{
    const person = new Person({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        phone: req.body.phone
    });
    person
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created object succesfully',
                createdPerson: {
                    _id: result._id,
                    name: result.name,
                    age: result.age, 
                    email: result.email,
                    phone: result.phone,
                    request:{
                        type:'GET',
                        url: 'http://localhost:3000/people/' + result._id
                    }
                }
            })
        })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    });
});

//Handles GET with personID requests to /people
router.get('/:personID',(req,res,next)=>{
    Person.findById(req.params.personID)
    .select('name age email phone')
    .exec()
    .then(doc =>{
        console.log("From database", doc);
        if(doc){
            res.status(201).json({
                Person: doc,
                request: {
                    type:'GET',
                    url: 'http://localhost:3000/people/'
                } 
            })
        }
        else {
            res.status(404).json({message:'No valid entry for provided ID'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

//Handles PATCH (update) with personID requests to /people
router.patch('/:personID', (req, res, next) => {
    const id = req.params.personID;
    Person.findByIdAndUpdate(id, {$set: req.body}, {new: true})
      .then(result => res.status(200).json({
          message: 'Person update',
          requst: {
              type: 'GET',
              url: 'http://localhost:3000/people/' + id
          }
      }))
      .catch(err => res.status(500).json({error: err}))
})

//Handles DELETE with personID requests to /people
router.delete('/:personID',(req,res,next)=>{
    Person.remove({_id: req.params.personID})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'Person deleted',
                requst: {
                    type: 'POST',
                    url: 'http://localhost:3000/people/',
                    body: {name:'String',age:'Number',email:'String',phone:'Number'}
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err});
        });
});

module.exports = router; 