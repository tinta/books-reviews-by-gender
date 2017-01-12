var uuid = require('node-uuid');
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('books.db')

const processReviews = (rawReviews) =>
  rawReviews.map(({
    NAME, LINK, RATING, BOOK_ID
  }) => ({
      NAME, LINK, RATING, BOOK_ID,
      ID: uuid.v4(),
      GENDER: '?',
      DATE: (new Date()).toISOString()
    })
  )

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

const writeToDB = (rawReviews) => {
  db.serialize(() =>
    processReviews(rawReviews)
      .forEach((review) => db.run(composeQuery(review)))
  )

  console.log('success!')
  db.close();
}

module.exports = writeToDB