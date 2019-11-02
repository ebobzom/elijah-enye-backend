const functions = require('firebase-functions');
const admin = require('firebase-admin');
const uuid = require("uuid/v5")
const cors= require("cors")({options: true, credentials: true});
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
app.use(helmet());
app.use(cors);
app.options('*', cors);

const  serviceAccount = require('./service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://elijah-enye-challenge-3.firebaseio.com"
});

exports.addId = functions.database.ref('/Users/{userId}/').onCreate((snapshot, context) => {
        const userId = context.params.userId ;
        const Id = uuid(userId,uuid.URL);
      return snapshot.ref.child('UserId').set(Id);
});

app.post('/', async (req,res)=>{
    res.set('Access-Control-Allow-Origin', '*');
    const userDetail = req.body;
    console.log(userDetail)
    try {
        await admin.database().ref('/Users').push(userDetail)
        res.status(200).json(userDetail)
    } catch (error) {
        console.log(error)
    }
   
});

app.get('/', async (req,res)=>{
    res.set('Access-Control-Allow-Origin', '*');
    await admin.database().ref('Users/').on('value', (snap) => { res.status(200).json(snap.val())}, (e) => {console.log(e); res.json({message: 'error', error: e})})
})
    
exports.addNewUser = functions.https.onRequest(app);