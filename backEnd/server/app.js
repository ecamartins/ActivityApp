const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'testfitness.cva6nowwhqhf.us-west-2.rds.amazonaws.com',
    user: 'ecamartins',
    password: 'password',
    database: 'activity_app'
})

const app = express()
const port = 4000

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

connection.connect();

app.get('/ranking', (req, res) => {
    let week = Number(req.query.week_num);
    connection.query(`select first_name, last_name, target_minutes, sum(duration) as total, sum(duration)/target_minutes*100 as percent from (select * from goals where week_num = '${week}') as filtered_goals natural join users natural join (select * from history where week(date) = '${week}') as weekly_hist group by users.user_id order by percent desc, total desc`, (err, rows) => {
        if (err) throw err
        let response = [];


        for (let row of rows) {
            response.push(
                {
                    first_name: row.first_name,
                    last_name: row.last_name,
                    target_minutes: row.target_minutes,
                    percent: row.percent,
                    total: row.total,
                }
            );
        }
        res.send(response);
    })
})

app.get('/userActivityHistory', (req, res) => {

    let user_id = Number(req.query.user_id);
    let week = Number(req.query.week);
    connection.query(`select first_name, last_name, target_minutes, sum(duration) as total, sum(duration)/target_minutes*100 as percent from (select * from goals where week_num = '${week}') as filtered_goals natural join users natural join (select * from history where week(date) = '${week}') as weekly_hist where user_id = '${user_id}'`, (err, info) => {
        if (err) throw err
        console.log(info);
        let response = {};
        // if the results of the query are empty, then the user has not set their weekly goal
        if (info[0].target_minutes == null) {
            response = {
                first_name: '',
                last_name: '',
                target_minutes: -1,
                percent: -1.0,
                total: -1,
            }
            // otherwise, query was not empty so send info
        } else {
                response = {
                    first_name: info[0].first_name,
                    last_name: info[0].last_name,
                    target_minutes: info[0].target_minutes,
                    percent: info[0].percent,
                    total: info[0].total,
                }
        }
        res.send(response);
    })
})

app.get('/userName', (req, res) => {
    let user_id = Number(req.query.user_id);
    connection.query(`select first_name, last_name from users where user_id = '${user_id}'`, (err, info) => {
        if (err) throw err
        let response = {};
        // if the results of the query are empty, then the user has not set their weekly goal
        response = {
            first_name: info[0].first_name,
            last_name: info[0].last_name,
        }
        res.send(response);
    })
})

app.post('/createUser', (req, res) => {
    const first_name = req.body.first_name.toString();
    const last_name = req.body.last_name.toString();

    connection.query(`select max(user_id) as max_id from users`, (err, rows) => {
        if (err) throw err
        let cur_id = rows[0].max_id;
        cur_id = cur_id + 1;
        connection.query(`INSERT INTO users (user_id, first_name, last_name) VALUES (${cur_id},'${first_name}', '${last_name}')`);
    })
})

app.get('/maxId', (req, res) => {
    console.log("here");
    connection.query('select max(user_id) as max_id from users', (err, id) => {
        if (err) throw err
        res.send(id[0].max_id.toString());
        console.log(id[0].max_id);
    })
})

app.post('/submitGoal', (req) => {
    const user_id = Number(req.body.user_id);
    const target_minutes = Number(req.body.target_minutes);
    const week = Number(req.body.week);

    connection.query(`insert into goals (user_id, week_num, target_minutes) VALUES ('${user_id}', '${week}', '${target_minutes}')`);
})



//
// app.get('/', (req, res) => {
//     console.log("got here")
//     res.send('Hello World!') // endpoints return a string
// })
// //defines another endpoint// this is what I am getting to the front
// app.get('/activityLog', (req, res) => {
//     console.log('books api requested');
//     connection.query('SELECT * FROM activityLog', (err, rows) => {
//         if (err) throw err
//         let response = [];
//
//         for (let row of rows) {
//             response.push(
//                 {
//                     name: row.name,
//                     activity: row.activity,
//                     duration: row.duration,
//                 }
//             );
//         }
//         console.log(response);
//         res.send(response);
//     })
// })
//
// app.get('/activityLog2', (req, res) => {
//     connection.query('SELECT name FROM activityLog', (err, rows) => {
//         if (err) throw err
//         let response = [];
//
//         for (let row of rows) {
//             response.push(
//                 {
//                     name: row.name,
//                 }
//             );
//         }
//         res.send(response);
//     })
// })
//
// app.post('/newActivity', (req) => {
//     console.log('newActivity api requested');
//     const name = req.body.name.toString();
//     const activity = req.body.activity.toString();
//     const duration = req.body.duration;
//
//     connection.query(`INSERT INTO activityLog (name, activity, duration) VALUES ('${name}', '${activity}', ${duration})`);
// })
//
// app.get('/activityHistory', (req, res) => {
//     connection.query('SELECT * FROM activityLog', (err, rows) => {
//         if (err) throw err
//         let response = [];
//
//         for (let row of rows) {
//             response.push(
//                 {
//                     name: row.name,
//                     activity: row.activity,
//                     duration: row.duration,
//                 }
//             );
//         }
//         res.send(response);
//     })
// })
//
app.get('/members', (req, res) => {
    connection.query('SELECT user_id, first_name, last_name FROM users', (err, rows) => {
        if (err) throw err
        let response = [];

        for (let row of rows) {
            response.push(
                {
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name
                }
            );
        }
        res.send(response);
    })
})
//
// app.get('/memberActivities', (req, res) => {
//     let nameID = req.query.nameID;
//     connection.query(`SELECT activity, duration FROM activityLog where nameID='${nameID}'`, (err, rows) => {
//         if (err) throw err
//         let response = [];
//
//         for (let row of rows) {
//             response.push(
//                 {
//                     activity: row.activity,
//                     duration: row.duration,
//                 }
//             );
//         }
//         console.log("here");
//         console.log(response);
//         res.send(response);
//     })
// })
//
//
//
app.get('/trial', (req, res) => {
    res.send('Happy Friday!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})