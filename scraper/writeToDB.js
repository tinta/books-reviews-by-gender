const sqlite3 = require('sqlite3').verbose();

GENDER = 'GENDER'
DATE = 'DATE'
RATING = 'RATING'
NAME = 'NAME'
LINK = 'LINK'
BOOK_ID = 'BOOK_ID'
ID = 'ID'

const REVIEW_TABLE = 'reviews'

const insertQ = (items) => `INSERT INTO ${REVIEW_TABLE} VALUES (${items})`

const writeToDB = (items) => {
  var db = new sqlite3.Database('foo.db');

  db.serialize(() => {
    items.forEach((item) => {
      const query = insertQ([
        item[ID],
        item[BOOK_ID],
        item[NAME],
        item[GENDER],
        item[DATE],
        item[RATING],
        item[LINK]
      ].join(' , '))

      db.exec(query)
    })

  });

  db.close();
}

module.exports = writeToDB