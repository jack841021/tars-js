const express = require('express')

const schedule = require('./parts/schedule')

const app = express()

String.prototype.format = function () {
    let a = this
    for (let b of arguments) {
        a = a.replace('{}', b)
    }
    return a
}

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Stand by.')
})

app.post('/', schedule.handler)

app.listen(3000, () => {
    console.log('TARS listening on port 3000!')
})