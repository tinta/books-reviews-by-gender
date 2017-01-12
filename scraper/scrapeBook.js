var Nightmare = require('nightmare')

const getUrl = (isbn, page) => `https://www.goodreads.com/api/reviews_widget_iframe?did=0&format=html&isbn=${isbn}&links=660&min_rating=&page=${page}&review_back=fff&stars=000&text=000`

const scrapeBook = (isbn) => {
    const MASTER_MAPPING = []

    const scrapePage = (isbn, page) => {
        const url = getUrl(isbn, page)
        console.log(url)
        return Nightmare({ show: true, frame: false, transparent: true, x: 0, y: 0, maxWidth: 1 })
        .goto(url)
        .evaluate(() => {
            const cleanseStr = (str) => str.replace(/\W/g, '')

            REVIEW_MAPPING = {
                '★☆☆☆☆': 1,
                '★★☆☆☆': 2,
                '★★★☆☆': 3,
                '★★★★☆': 4,
                '★★★★★': 5
            }


            items = Array.from(document.querySelectorAll('.gr_review_container'))
            .reduce((memo, container) => {
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

            return items
        })
        .end()
        .then((result) => {
            MASTER_MAPPING.push(...result)
        })
    }

    const scrapeBookByPage = (isbn, startPage, endPage) => {
        return scrapePage(isbn, startPage).then(() => {
            if (startPage < endPage) return new Promise((resolve, reject) => {
                console.log(MASTER_MAPPING.length)
                setTimeout(() => scrapeBookByPage(isbn, startPage + 1, endPage).then(resolve), 1000)
            })
        })
    }


    return scrapeBookByPage(isbn, 50, 51)
    .then((foo) =>
        MASTER_MAPPING.map((item) =>
            Object.assign(item, { BOOK_ID: isbn })
        )
    )

}


module.exports = scrapeBook