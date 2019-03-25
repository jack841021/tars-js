const axios = require('axios')
const dotenv = require('dotenv')

const line = require('./line')

dotenv.config()
const es_host = process.env.es_host

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms))
}

async function get(user, hook) {
    await sleep(500)
    let result = await axios.get(es_host + 'subscribe/object/' + user)
    let keywords = result.data._source.keywords
    if (!keywords.length) {
        keywords.push('empty')
    }
    await line.reply(keywords.join('\n'), hook)
}

async function add(user, keyword, hook) {
    keyword = keyword.toLowerCase()
    try {
        let result = await axios.get(es_host + 'subscribe/object/' + user)
        let keywords = result.data._source.keywords
        keywords.push(keyword)
        await axios.post(es_host + 'subscribe/object/' + user, { keywords })
    }
    catch (error) {
        if (!error.response.data.found) {
            await axios.post(es_host + 'subscribe/object/' + user, { keywords: [keyword] })
        }
    }
    await get(user, hook)
}

async function del(user, keyword, hook) {
    let result = await axios.get(es_host + 'subscribe/object/' + user)
    let keywords = result.data._source.keywords.filter(k => !k.includes(keyword))
    await axios.post(es_host + 'subscribe/object/' + user, { keywords })
    await get(user, hook)
}

module.exports = { get, add, del }
