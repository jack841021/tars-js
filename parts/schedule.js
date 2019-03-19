const axios = require('axios')
const dotenv = require('dotenv')
const moment = require('moment')

const reply = require('./reply')

dotenv.config()
const es_host = process.env.es_host

function get(user, hook) {
    axios.get(es_host + 'schedule/object/_search?&q=user:{}&sort=time:asc'.format(user)).then(
        result => {
            let schedules = result.data.hits.hits.map(doc => {
                return moment(doc._source.time).utcOffset(+8).format('MM/DD HH:mm') + ' ' + doc._source.task
            })
            reply(user, schedules.join('\n'), hook)
        }
    )
}

function add(user, time, task, hook) {
    axios.post(es_host + 'schedule/object', { user, time, task }).then(
        get(user, hook)
    )
}

function del(user, task, hook) {
    axios.get(es_host + 'schedule/object/_search?q=user:{}&size=10000'.format(user)).then(
        result => {
            result.data.hits.hits.forEach(doc => {
                if (doc._source.task == task) {
                    axios.delete(es_host + 'schedule/object/' + doc._id)
                }
            })
        }
    ).then(get(user, hook))
}

module.exports = { get, add, del }