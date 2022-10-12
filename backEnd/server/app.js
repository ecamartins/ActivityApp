const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'testfitness.cva6nowwhqhf.us-west-2.rds.amazonaws.com',
    user: 'ecamartins',
    password: 'password',
    database: 'test'
})

const app = express()
const port = 4000

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

connection.connect();

app.get('/', (req, res) => {
    console.log("got here")
    res.send('Hello World!') // endpoints return a string
})
//defines another endpoint// this is what I am getting to the front
app.get('/activityLog', (req, res) => {
    console.log('books api requested');
    connection.query('SELECT * FROM activityLog', (err, rows) => {
        if (err) throw err
        let response = [];

        for (let row of rows) {
            response.push(
                {
                    name: row.name,
                    activity: row.activity,
                    duration: row.duration,
                }
            );
        }
        console.log(response);
        res.send(response);
    })
})

app.post('/newActivity', (req) => {
    console.log('newActivity api requested');
    const name = req.body.name.toString();
    const activity = req.body.activity.toString();
    const duration = req.body.duration;

    connection.query(`INSERT INTO activityLog (name, activity, duration) VALUES ('${name}', '${activity}', ${duration})`);
})

app.get('/activityHistory', (req, res) => {
    connection.query('SELECT * FROM activityLog', (err, rows) => {
        if (err) throw err
        let response = [];

        for (let row of rows) {
            response.push(
                {
                    name: row.name,
                    activity: row.activity,
                    duration: row.duration,
                }
            );
        }
        res.send(response);
    })
})




app.get('/trial', (req, res) => {
    console.log("got here")
    res.send('Happy Friday!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})