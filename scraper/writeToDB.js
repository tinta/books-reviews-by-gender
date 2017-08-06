const uuid = require('node-uuid');
const sqlite3 = require('sqlite3').verbose()

const processReviews = (rawReviews) => {
  const reviews = rawReviews.map(({
    NAME, LINK, RATING, BOOK_ID
  }) => ({
      NAME, LINK, RATING, BOOK_ID,
      ID: uuid.v4(),
      GENDER: '?',
      DATE: (new Date()).toISOString()
    })
  )

  return reviews
}

const composeQuery = ({
    ID, BOOK_ID, NAME, GENDER, DATE, RATING, LINK
}) => `
  INSERT OR REPLACE INTO reviews (
    ID, BOOK_ID, NAME, GENDER, DATE, RATING, LINK
  ) VALUES (
    '${ID}',
    '${BOOK_ID}',
    '${NAME}',
    '${GENDER}',
    '${DATE}',
    ${RATING},
    '${LINK}'
  );
`

const writeToDB = (rawReviews) => new Promise((resolve, reject) => {
  const db = new sqlite3.Database('books.db')
  db.serialize(() => {
    const reviews = processReviews(rawReviews)
    reviews.forEach((review, index) => {
      db.run(composeQuery(review))
    })

    db.close((err) => {
      if (err) return reject(err)
      return resolve(err)
    })
  })
})

module.exports = writeToDB