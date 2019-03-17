const express = require('express')
const app = express()

const reply = require('./features/reply')

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Stand by.')
})

app.post('/', reply.echo)

app.listen(3000, () => {
    console.log('TARS listening on port 3000!')
})