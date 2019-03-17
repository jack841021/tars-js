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
        time = moment(text.slice(0, 11) + ' +0800', 'MM/DD HH:mm ZZ').unix()
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
    console.log(event.message.text)
    let order = parse(event.message.text)
    if (order) {
        order.user_id = event.source.userId
        add(order)
        let message = {
            text: 'Roger that',
            replyToken: event.replyToken
        }
        reply(message)
    }
    res.sendStatus(200)
}

module.exports = { handler }