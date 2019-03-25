const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const token = process.env.token
const push_url = 'https://api.line.me/v2/bot/message/push'
const reply_url = 'https://api.line.me/v2/bot/message/reply'

async function push(user, text) {
    let body = {
        to: user,
        messages: [{ type: 'text', text }]
    }
    let headers = { 'Authorization': 'Bearer ' + token }
    await axios.post(push_url, body, { headers })
}

async function reply(text, hook) {
    let body = {
        replyToken: hook,
        messages: [{ type: 'text', text }]
    }
    let headers = { 'Authorization': 'Bearer ' + token }
    await axios.post(reply_url, body, { headers })
}

module.exports = { push, reply }
