const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const token = process.env.token
const reply_url = 'https://api.line.me/v2/bot/message/reply'

function reply(user, text, hook) {
    let body = {
        messages: [{ type: 'text', text }],
        replyToken: hook
    }
    let headers = { 'Authorization': 'Bearer ' + token }
    axios.post(reply_url, body, { headers })
}

module.exports = reply