var uuid = require('node-uuid');
const sqlite3 = require('sqlite3').verbose()
const maleNames = require('./maleNames')
const femaleNames = require('./femaleNames')
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

    return allScores / this.getTotal()
  }

  print () {
    console.log('')
    console.log(this.name)
    console.log(`total: ${this.getTotal()}`)
    console.log(`average: ${this.getAverage()}`)
    return [1,2,3,4,5].forEach((item) => {
      const percent = (
        this.collection[item] /
        this.getTotal() *
        100
      )
      console.log(`${item} | ${percent}`)
    })
  }
}

const check = (arr, str) => arr
  .map((item) => item.toLowerCase())
  .some((item) => item === str)

const cleanseNames = () => {
  db.serialize(() => {
    let male = new Ratings('male')
    let female = new Ratings('female')
    let andro = new Ratings('andro')
    db.each("SELECT NAME, RATING FROM reviews", (err, { NAME, RATING }) => {

      const name = NAME.split(' ')[0].toLowerCase()
      if (name === '') return
      // console.log(name)
      // if (name)
      // const name = NAME
      const reviwerIsMale = check(maleNames, name)
      const reviewerIsFemale = check(femaleNames, name)
      if (reviwerIsMale && reviewerIsFemale) {
        andro.add(RATING)
      } else {
        if (reviwerIsMale) {
          // names.push(name)
          male.add(RATING)
        }
        if (reviewerIsFemale) female.add(RATING)
      }
    }, () => {
      const total = male.getTotal() + female.getTotal() + andro.getTotal()
      console.log(`total reviews: ${total}`)

      male.print()
      female.print()
      andro.print()
    })
  })

  db.close();
}

module.exports = cleanseNames()