const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const token = process.env.token
const es_host = process.env.es_host
const push_url = 'https://api.line.me/v2/bot/message/push'

function push(doc) {
    let body = {
        to: doc._source.user,
        messages: [{
            type: 'text',
            text: doc._source.text
        }]
    }
    let headers = { 'Authorization': 'Bearer ' + token }
    axios.post(push_url, body, { headers })
    axios.post(es_host + 'schedule/object/{}/_update'.format(doc._id), { doc: { sent: true } })
}

module.exports = push