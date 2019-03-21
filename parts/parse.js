const moment = require('moment')

const check = require('./meetup')
const reply = require('./reply')
const keyword = require('./keyword')
const schedule = require('./schedule')

async function parse(req, res) {
    let event = req.body.events[0]
    let user = event.source.userId
    let text = event.message.text
    let hook = event.replyToken
    let words = text.split(' ')
    if (words[0] == 'sch') {
        if (words[1] == 'add') {
            let time = moment('{} {} +0800'.format(words[2], words[3]), 'M/D H:m Z').unix()
            let task = words.slice(4).join(' ')
            await schedule.add(user, time, task, hook)
        }
        else if (words[1] == 'get') {
            await schedule.get(user, hook)
        }
        else if (words[1] == 'del') {
            let task = words.slice(2).join(' ')
            await schedule.del(user, task, hook)
        }
    }
    else if (words[0] == 'key') {
        if (words[1] == 'add') {
            let keyword = words.slice(2).join(' ')
            await keyword.add(user, keyword, hook)
        }
        else if (words[1] == 'get') {
            await keyword.get(user, hook)
        }
        else if (words[1] == 'del') {
            let keyword = words.slice(2).join(' ')
            await keyword.del(user, keyword, hook)
        }
        else if (words[1] == 'chk') {
            await check()
        }
    }
    else {
        await reply(user, '?', hook)
    }
    res.sendStatus(200)
}

module.exports = parse
