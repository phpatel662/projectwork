const path = require ('path')
const express = require('express')
//const mongo = require('mongodb').MongoClient
//const url = 'mongodb://localhost:27017'
const passport = require('passport')

const app = express()
app.use(express.json())

let db, trips, expenses

// mongo.connect(
//   url,
//   (err, client) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     db = client.db('tripcost')
//     trips = db.collection('trips')
//     expenses = db.collection('expenses')
//   }
// )

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "915509958935-lfmah8cpse2lvileh3dja0u9scsvdc0r.apps.googleusercontent.com",
    clientSecret: "1UUTWKVFX2FwxicCxujMi0AO",
    callbackURL: "localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.post('/trip', (req, res) => {
  const name = req.body.name
  trips.insertOne({ name: name }, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    res.status(200).json({ ok: true })
  })
})

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get('/trips', (req, res) => {
    trips.find().toArray((err, items) => {
        if (err) {
          console.error(err)
          res.status(500).json({ err: err })
          return
        }
        res.status(200).json({ trips: items })
      })
})
app.post('/expense', (req, res) => {
    expenses.insertOne(
        {
          trip: req.body.trip,
          date: req.body.date,
          amount: req.body.amount,
          category: req.body.category,
          description: req.body.description
        },
        (err, result) => {
          if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
          }
          res.status(200).json({ ok: true })
        })
})
app.get('/expenses', (req, res) => {
    expenses.find({trip: req.body.trip}).toArray((err, items) => {
        if (err) {
          console.error(err)
          res.status(500).json({ err: err })
          return
        }
        res.status(200).json({ trips: items })
      })
})

app.listen(3000, () => console.log('Server ready'))
