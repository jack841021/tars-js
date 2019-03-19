const express = require('express')

const parse = require('./parts/parse')

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

app.post('/', parse)

app.listen(3000, () => {
    console.log('TARS is listening on port 3000!')
})