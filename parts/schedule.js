const cron = require('node-cron')
const axios = require('axios')
const dotenv = require('dotenv')
const moment = require('moment')

const push = require('./push')
const reply = require('./reply')

dotenv.config()
const es_host = process.env.es_host

cron.schedule('* * * * *', () => {
    check()
})

function parse(text) {
    let time = text.slice(0, 11)
    if (time.match(/\d\d\/\d\d \d\d:\d\d/)) {
        time = moment(text.slice(0, 11), 'MM/DD HH:mm').unix()
        text = text.slice(12)
        return { time, text }
    }
    return null
}

function add(schedule) {
    axios.post(es_host + 'schedule/object', schedule)
}

function check() {
    let url = es_host + 'schedule/object/_search?q=(time:<{})AND(NOT(sent:true))'
    axios.get(url.format(moment().unix())).then(result => {
        result.data.hits.hits.forEach(doc => {
            push(doc)
        })
    })
}

function handler(req, res) {
    let event = req.body.events[0]
    let schedule = parse(event.message.text)
    schedule.user_id = event.source.userId
    add(schedule)
    let message = {
        replyToken: event.replyToken,
        text: 'Roger'
    }
    reply(message)
    res.sendStatus(200)
}

module.exports = { handler }