const axios = require('axios')
const dotenv = require('dotenv')
const moment = require('moment')

const reply = require('./reply')

dotenv.config()
const es_host = process.env.es_host

function sleep(ms) {
    return new Promise(res => {
        setTimeout(res, ms)
    })
}

async function get(user, hook) {
    await sleep(1000)
    let result = await axios.get(es_host + 'schedule/object/_search?&q=user:{}&sort=time:asc'.format(user))
    let docs = result.data.hits.hits
    let schedules = docs.map(doc =>
        moment(doc._source.time * 1000).utcOffset(8).format('MM/DD HH:mm') + ' ' + doc._source.task
    )
    if (!schedules.length) {
        schedules = ['empty']
    }
    await reply(user, schedules.join('\n'), hook)
}

async function add(user, time, task, hook) {
    await axios.post(es_host + 'schedule/object', { user, time, task })
    await get(user, hook)
}

async function del(user, task, hook) {
    let result = await axios.get(es_host + 'schedule/object/_search?q=user:{}&size=10000'.format(user))
    let docs = result.data.hits.hits
    await Promise.all(docs.map(doc => {
        if (doc._source.task.includes(task)) {
            return axios.delete(es_host + 'schedule/object/' + doc._id)
        }})
    )
    await get(user, hook)
}

module.exports = { get, add, del }
