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
    let year = Number(req.query.year);
    let day_one = req.query.day_one;
    let day_seven = req.query.day_seven;

    connection.query(`select user_id, first_name, last_name, target_minutes, sum(duration) as total, sum(duration)/target_minutes*100 as percent from (select * from goals where week_num = '${week}' and year = '${year}') as filtered_goals natural join users natural join (select * from history where date between '${day_one}' and '${day_seven}') as weekly_hist group by users.user_id order by percent desc, total desc`, (err, rows) => {
        if (err) throw err
        let response = [];

        for (let row of rows) {
            response.push(
                {
                    user_id: row.user_id,
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

app.get('/histLog', (req, res) => {
    let day_one = req.query.day_one;
    let day_seven = req.query.day_seven;
    let user_id = Number(req.query.user_id);
    connection.query(`select activity_name, duration, date, hist_id from history natural join users natural join activities where user_id = '${user_id}' and date between '${day_one}' and '${day_seven}' order by date asc`, (err, rows) => {
        if (err) throw err
        let response = [];

        for (let row of rows) {
            response.push(
                {
                    activity_name: row.activity_name,
                    duration: row.duration,
                    date: row.date,
                    hist_id: row.hist_id
                }
            );
        }
        res.send(response);
    })
})

app.get('/activityList', (req, res) => {
    connection.query(`select activity_name, activity_id from activities order by activity_name asc`, (err, rows) => {
        if (err) throw err
        let response = [];


        for (let row of rows) {
            response.push(
                {
                    activity_id: row.activity_id,
                    activity_name: row.activity_name
                }
            );
        }
        res.send(response);
    })
})

app.post('/addToLog', (req, res) => {
    const user_id = Number(req.body.user_id);
    const activity_id = Number(req.body.activity_id);
    const date = req.body.date.toString();
    const duration = Number(req.body.duration);

    connection.query(`select max(hist_id) as max_id from history`, (err, rows) => {
        if (err) throw err
        let cur_id = rows[0].max_id;
        cur_id = cur_id + 1;
        connection.query(`insert into history (user_id, activity_id, duration, date, hist_id) 
                            values ('${user_id}','${activity_id}', '${duration}', 
                            '${date}', ${cur_id})`,(err, rows) => {
            res.send();
        })
    })
})


app.delete('/deleteLogEntry', (req, res) => {
    const hist_id = Number(req.body.hist_id);

    connection.query(`delete from history where hist_id = '${hist_id}'`, (err, rows) => {
        if (err) throw err
        res.send();
    })
})

app.get('/userActivityHistory', (req, res) => {
    let user_id = Number(req.query.user_id);
    let day_one = req.query.day_one;
    let day_seven = req.query.day_seven;
    let week = req.query.week_num;
    let year = req.query.year;
    connection.query(`select * from goals where user_id = '${user_id}' and week_num = '${week}' and year = '${year}'`, (err, info) => {
        if (err) throw err
        let response = {};
        //if the results of the query are empty, then the user has not set their weekly goal
        if (info.length == 0) {
            response = {
                target_minutes: -1,
                percent: 0.0,
                total: 0,
            }
            res.send(response);

            // otherwise, goal is set so check if user has history for given week
        } else {
            connection.query(`select * from history where user_id = '${user_id}' and date between '${day_one}' and '${day_seven}'`, (err, info2) => {
                if (err) throw err
                // if there is no history, then the user only has a goal with no entered history for the given week
                if (info2.length == 0){
                    response = {
                        target_minutes: info[0].target_minutes,
                        percent: 0.0,
                        total: 0,
                    }
                    res.send(response);
                    // otherwise, the user has both a goal and history for given week, get compute total and percent
                } else{
                    connection.query(`select target_minutes, sum(duration) as total, sum(duration)/target_minutes *100 as percent from history natural join goals where user_id = '${user_id}' and year = '${year}' and week_num = '${week}' and date between '${day_one}' and '${day_seven}';`, (err, info3) => {
                    //connection.query(`select target_minutes, sum(duration) as total, sum(duration)/target_minutes *100 as percent from history natural join goals where user_id = '${user_id}' and week(date) = '${week}' and week_num = '${week}'`, (err, info3) => {
                        if (err) throw err
                        let response = {
                            target_minutes: info3[0].target_minutes,
                            percent: info3[0].percent,
                            total: info3[0].total,
                        }
                        res.send(response);
                    })
                }

            })

        }
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
        connection.query(`INSERT INTO users (user_id, first_name, last_name) VALUES (${cur_id},'${first_name}', '${last_name}')`,(err, rows) => {
            res.send();
        })
    })
})

app.post('/createActivity', (req, res) => {
    const activity_name = req.body.activity_name.toString();

    connection.query(`select max(activity_id) as max_id from activities`, (err, rows) => {
        if (err) throw err
        let cur_id = rows[0].max_id;
        cur_id = cur_id + 1;
        connection.query(`INSERT INTO activities (activity_id, activity_name) VALUES (${cur_id},'${activity_name}')`,(err, rows) => {
            res.send();
        })
    })
})

app.post('/submitGoal', (req) => {
    const user_id = Number(req.body.user_id);
    const target_minutes = Number(req.body.target_minutes);
    const week = Number(req.body.week);
    const year = Number(req.body.year);

    connection.query(`insert into goals (user_id, week_num, target_minutes, year) VALUES (${user_id}, ${week}, ${target_minutes}, ${year})`);
})

app.get('/members', (req, res) => {
    connection.query('select user_id, first_name, last_name from users order by first_name, last_name asc', (err, rows) => {
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})