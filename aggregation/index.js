const uuid = require('node-uuid');
const maleNames = require('./../data/maleNames')
const femaleNames = require('./../data/femaleNames')
const ISBNs = require('./../data/ISBNs')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('books.db');


class Ratings {
  constructor (name) {
    Object.assign(this, {
      name,
      collection: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    })
  }

  add (rating) {
    this.collection[rating] += 1
  }

  getTotal () {
    return [1,2,3,4,5].reduce((memo, item) => {
      return memo + this.collection[item]
    }, 0)
  }

  getAverage () {
    const allScores = [1,2,3,4,5].reduce((memo, item) => {
      return memo + item * this.collection[item]
    }, 0)

    return String(allScores / this.getTotal()).substring(0, 4)
  }

  print () {
    console.log('')
    console.log('')
    console.log(this.name)
    console.log(Array(50).join('='))
    console.log(`Total Ratings: ${this.getTotal()}`)
    console.log(`Average Rating: ${this.getAverage()}/5.00`)
    console.log('')
    console.log('Rating | % of reviewers that gave this rating')
    console.log('-------+------------')
    return [1,2,3,4,5].forEach((item) => {
      const percent = (
        this.collection[item] /
        this.getTotal() *
        100
      )
      const percentStr = `${String(percent).substring(0,4)}%`
      console.log(`${item}      | ${percentStr}`)
    })
  }
}

const check = (arr, str) => arr
  .map((item) => item.toLowerCase())
  .some((item) => item === str)

const aggregate = (isbn) => {
  db.serialize(() => {
    const male = new Ratings('Male Reviewers')
    const female = new Ratings('Female Reviewers')
    const andro = new Ratings('Androgynously-Named Reviewers')
    const query = `SELECT NAME, RATING, BOOK_ID FROM reviews WHERE BOOK_ID = ${isbn}`
    console.log(query)
    db.each(query, (err, { NAME, RATING, BOOK_ID }) => {
      // console.log(BOOK_ID)
      const name = NAME.split(' ')[0].toLowerCase()
      if (name === '') return
      const reviwerIsMale = check(maleNames, name)
      const reviewerIsFemale = check(femaleNames, name)
      if (reviwerIsMale && reviewerIsFemale) {
        andro.add(RATING)
      } else {
        if (reviwerIsMale) {
          male.add(RATING)
        }
        if (reviewerIsFemale) female.add(RATING)
      }
    }, () => {
      const total = male.getTotal() + female.getTotal() + andro.getTotal()
      console.log(`ISBN: ${isbn}`)
      console.log(`Total ratings (all genders): ${total}`)

      male.print()
      female.print()
      andro.print()
    })
  })

  db.close();
}

module.exports = aggregate(ISBNs.greatGatsby)