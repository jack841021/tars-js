const axios = require('axios')
const dotenv = require('dotenv')
const express = require('express')

dotenv.config()
const app = express()
const TOKEN = process.env.TOKEN

app.use(express.json())

app.post('/', async function (req, res) {
    let headers = { 'Authorization': 'Bearer ' + TOKEN }
    let event = req.body.events[0]
    let body = {
        replyToken: event.replyToken,
        messages: [{
            type: 'text',
            text: event.message.text
        }]
    }
    await axios.post('https://api.line.me/v2/bot/message/reply', headers, body)
    res.sendStatus(200)
})

app.listen(3000, function () {
    console.log('TARS listening on port 3000!')
})