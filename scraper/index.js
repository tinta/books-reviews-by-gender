const scrapeBook = require('./scrapeBook')
const writeToDB = require('./writeToDB')

scrapeBook('0316769177').then((rawReviews) => {
    writeToDB(rawReviews)
})

