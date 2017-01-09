const scrapeBook = require('./scrapeBook')
const writeToDB = require('./writeToDB')

scrapeBook('0316769177').then((foo) => {
    console.log('foo')
    console.log(foo)
    writeToDB(foo)
})

