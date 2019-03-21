const axios = require('axios')
const dotenv = require('dotenv')

const reply = require('./reply')

dotenv.config()
const es_host = process.env.es_host

async function add(user, keyword, hook) {
    let result = await axios.get(es_host + 'keyword/array/' + user)
    let keywords = result.data.keywords.push(keyword)
    await axios.post(es_host + 'keywords/array/' + user, { keywords })
    await reply(user, keywords.join(' '), hook)
}

async function get(user, hook) {
    let result = await axios.get(es_host + 'keyword/array/' + user)
    await reply(user, result.data.keywords.join(' '), hook)
}

async function del(user, keyword, hook) {
    let result = await axios.get(es_host + 'keyword/array/' + user)
    let keywords = result.data.keywords.filter(K => K != keyword)
    await axios.post(es_host + 'keywords/array/' + user, { keywords })
    await reply(user, result.data.keywords.join(' '), hook)
}

module.exports = { add, get, del }
