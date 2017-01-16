const scrapeBook = require('./scrapeBook')

scrapeBook('0316769177')
    .then(() => {
        console.log('success!')
    }, (err) => {
        console.log('failure!')
        console.log(err)
    })
