const cors = require('cors')
const express = require('express')
const app = express()
const port = 4000

app.use(cors())

app.get('/', (req, res) => {
    console.log("got here")
    res.send('Hello World!')
})

app.get('/trial', (req, res) => {
    console.log("got here")
    res.send('Happy Friday!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})