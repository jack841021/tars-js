const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const TOKEN = process.env.TOKEN
const reply_url = 'https://api.line.me/v2/bot/message/reply'

function echo(req, res) {
    let event = req.body.events[0]
    let body = {
        replyToken: event.replyToken,
        messages: [{
            type: 'text',
            text: event.message.text
        }]
    }
    let headers = { 'Authorization': 'Bearer ' + TOKEN }
    axios.post(reply_url, body, { headers }).then(
        result => {
            res.sendStatus(200)
        }
    ).catch(
        error => {
            console.log(error)
            res.sendStatus(500)
        }
    )
}

module.exports = { echo }