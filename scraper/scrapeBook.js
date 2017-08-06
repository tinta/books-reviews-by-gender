const Nightmare = require('nightmare')
const writeToDB = require('./writeToDB')
const _ = require('lodash')

const getUrl = (isbn, page) => `https://www.goodreads.com/api/reviews_widget_iframe?did=0&format=html&isbn=${isbn}&links=660&min_rating=&page=${page}&review_back=fff&stars=000&text=000`

const evaluateInClientConsole = () => {
    const cleanseStr = (str) => str ? str.replace(/\W/g, '') : str

    const REVIEW_MAPPING = {
        '★☆☆☆☆': 1,
        '★★☆☆☆': 2,
        '★★★☆☆': 3,
        '★★★★☆': 4,
        '★★★★★': 5
    }

    const nodesToScrape = Array.from(document.querySelectorAll('.gr_review_container'))

    const scrapedReviews = nodesToScrape.reduce((memo, container) => {
        const name = container.querySelector('.gr_review_by a')
        const review = container.querySelector('.gr_rating')

        if (!name || !name.innerText || !review) return memo

        const cleansedName = cleanseStr(name.innerText)
        if (
            cleansedName === '' ||
            cleansedName.length < 3
        ) return memo

        return memo.concat({
            NAME: cleansedName,
            LINK: name.href,
            RATING: REVIEW_MAPPING[ review.innerText ]
        })
    }, [])

    return scrapedReviews
}

const processReviews = (isbn, reviews) =>
    reviews.map((review) => Object.assign(review, {
        BOOK_ID: isbn
    }))

const thenDelay = (time) => new Promise((resolve) => setTimeout(resolve, time))

const scrapePage = (isbn, page) => {
    const url = getUrl(isbn, page)
    console.log(`scraping: ${url}`)
    const options = { show: true, frame: false, transparent: true, x: 0, y: 0, maxWidth: 1 }
    return Nightmare(options)
        .goto(url)
        .evaluate(evaluateInClientConsole)
        .end()
}

const scrapeBookByPage = (isbn, pageToScrape, numOfPages) => new Promise((resolve, reject) =>
    scrapePage(isbn, pageToScrape).then((result) => {
        if (!result || result.length === 0) return null

        console.log(`Writing ${result.length} reviews to DB`)
        const reviews = processReviews(isbn, result)
        return writeToDB(reviews)
    }, (err) => {
        console.log(`scrapePage() failed: ${isbn} ${pageToScrape}`)
        return reject(err)
    }).then(() => {
        if (numOfPages <= 1) return resolve('all request pages have been scraped')
        return thenDelay(_.random(500, 3000))
            .then(() =>
                scrapeBookByPage(isbn, pageToScrape + 1, numOfPages - 1).then(resolve)
            )
    })
)

const scrapeBook = (isbn) =>
    scrapeBookByPage(isbn, 0, 5000).then(() => {
        console.log('scrapeBookByPage() success')
        return true
    }, (err) => {
        console.log('scrapeBookByPage() error:')
        console.log(err)
        return false
    })

module.exports = scrapeBook
