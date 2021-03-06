const cron = require('node-cron')
const axios = require('axios')
const dotenv = require('dotenv')
const moment = require('moment')

const line = require('./line')

dotenv.config()
const es_host = process.env.es_host

cron.schedule('0 9 * * *', () => {
    check()
})

async function check() {
    let start = moment().utcOffset(8).format('YYYY-MM-DD')
    let end = moment().add(28, 'day').utcOffset(8).format('YYYY-MM-DD')
    let result = await axios.get(es_host + 'subscribe/object/_search?size=10000')
    for (let doc of result.data.hits.hits) {
        let urls = []
        for (let keyword of doc._source.keywords) {
            let result = await axios.get('https://kktix.com/events.json?search={}&start_at={}&end_at={}'.format(keyword, start, end))
            for (let entry of result.data.entry) {
                if ((entry.title + entry.summary).toLowerCase().includes(keyword)) {
                    urls.push(entry.url)
                }
            }
        }
        if (urls.length) {
            await Promise.all(urls.map(url => line.push(doc._id, url)))
        }
        else {
            await line.push(doc._id, 'not found')
        }
    }
}

module.exports = { check }
