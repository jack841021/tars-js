const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const token = process.env.token
const reply_url = 'https://api.line.me/v2/bot/message/reply'

function reply(message) {
    let body = {
        messages: [{
            type: 'text',
            text: message.text
        }],
        replyToken: message.replyToken
    }
    let headers = { 'Authorization': 'Bearer ' + token }
    axios.post(reply_url, body, { headers })
}

module.exports = reply