const cron = require('node-cron')

const push = require('./push')

cron.schedule('* * * * *', () => {
    check()
})

function check() {
    let url = es_host + 'schedule/object/_search?q=(time:<{})AND(NOT(sent:true))'
    axios.get(url.format(moment().unix())).then(result => {
        result.data.hits.hits.forEach(doc => {
            push(user, doc)
        })
    })
}