const scrapeBook = require('./scrapeBook')
const ISBNs = require('./../data/ISBNs')

scrapeBook(ISBNs.greatGatsby)
    .then(() => {
        console.log('success!')
    }, (err) => {
        console.log('failure!')
        console.log(err)
    })
