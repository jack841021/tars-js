const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const token = process.env.token

function push(user, text) {
    let body = {
        to: user,
        messages: [{ type: 'text', text }]
    }
    let headers = { 'Authorization': 'Bearer ' + token }
    axios.post('https://api.line.me/v2/bot/message/push', body, { headers })
}

module.exports = push
