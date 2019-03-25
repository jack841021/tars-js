const moment = require('moment')

const line = require('./line')
const task = require('./task')
const meetup = require('./meetup')
const subscribe = require('./subscribe')

async function parse(req, res) {
    let event = req.body.events[0]
    let user = event.source.userId
    let text = event.message.text
    let hook = event.replyToken
    let words = text.split(' ')
    if (words[0] == 'task') {
        if (words[1] == 'add') {
            let time = moment('{} {} +0800'.format(words[2], words[3]), 'M/D H:m Z').unix()
            await task.add(user, time, words.slice(4).join(' '), hook)
        }
        else if (words[1] == 'get') {
            await task.get(user, hook)
        }
        else if (words[1] == 'del') {
            await task.del(user,words.slice(2).join(' '), hook)
        }
    }
    else if (words[0] == 'meet') {
        if (words[1] == 'add') {
            let keyword = words.slice(2).join(' ')
            await subscribe.add(user, keyword, hook)
        }
        else if (words[1] == 'get') {
            await subscribe.get(user, hook)
        }
        else if (words[1] == 'del') {
            let keyword = words.slice(2).join(' ')
            await subscribe.del(user, keyword, hook)
        }
        else if (words[1] == 'chk') {
            await meetup.check()
        }
    }
    else {
        await line.reply('?', hook)
    }
    res.sendStatus(200)
}

module.exports = parse
