var uuid = require('node-uuid');
var _ = require('lodash')
var Nightmare = require('nightmare')

const getUrl = (isbn, page) => `https://www.goodreads.com/api/reviews_widget_iframe?did=0&format=html&isbn=${isbn}&links=660&min_rating=&page=${page}&review_back=fff&stars=000&text=000`

const scrapeBook = (isbn) => {
    const MASTER_MAPPING = []

    const scrapePage = (isbn, page) => {
        const url = getUrl(isbn, page)
        console.log(url)
        return Nightmare({ show: true })
        .goto(url)
        .evaluate(() => {
            REVIEW_MAPPING = {
                '★☆☆☆☆': 1,
                '★★☆☆☆': 2,
                '★★★☆☆': 3,
                '★★★★☆': 4,
                '★★★★★': 5
            }


            items = Array.from(document.querySelectorAll('.gr_review_container'))
            // console.log
            // item = boo
            .reduce((memo, container) => {
                var name = container.querySelector('.gr_review_by a')
                var review = container.querySelector('.gr_rating')
                if (name && review) memo.push({
                    NAME: name.innerText.split(' ')[0],
                    LINK: name.href,
                    RATING: REVIEW_MAPPING[ review.innerText ]
                })

                return memo
            }, [])

            return items
        })
        .end()
        .then((result) => {
            MASTER_MAPPING.push(...result)
        })
    }

    const scrapeBookByPage = (isbn, pageNumber) => {
        return scrapePage(isbn, pageNumber).then(() => {
            if (pageNumber > 1) return scrapeBookByPage(isbn, pageNumber - 1)
        })
    }


    return scrapeBookByPage(isbn, 1).then((foo) => {
        return MASTER_MAPPING.map((item) => Object.assign(item, {
            BOOK_ID: isbn,
            ID: uuid.v4(),
            GENDER: '?',
            DATE: (new Date()).toISOString()
        }))
    })

}


module.exports = scrapeBook