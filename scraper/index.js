const scrapeBook = require('./scrapeBook')
const writeToDB = require('./writeToDB')

scrapeBook('0316769177').then((rawReviews) => {
    console.log('rawReviews')
    console.log(rawReviews)
    writeToDB(rawReviews)
})

