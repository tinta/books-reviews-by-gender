const axios = require('axios')
const curl = require('node-curl')

const url = `
https://www.goodreads.com/book/reviews/7905917-alexander-hamilton?authenticity_token=hFKWP5xt4pkmqLjdrRnZk2oQNCiytiUJOQ%2B7og%2Fv9EL5PzEUMc8whdZDC9uEYmNRwbpEiD1Jsv77DXQ2FKgs%2Fg%3D%3D&amp;hide_last_page=true&amp;page=2&authenticity_token=oCKptR3dUtqWnHH99JZEIHv83ha1Ibi%2FUF8lA5iAdDbdTw6esH%2BAxmZ3wvvd7f7i0FautjreL0iSXeqXg8esig%3D%3D
`

// axios.get(url).then((data) => {
//   console.log(data)
// }, (err) => {
//   console.log(err)
// })

curl(url, (err) => {
  if (err) return console.info(err)
  console.info(this.status);
  console.info('-----');
  console.info(this.body);
  console.info('-----');
  console.info(this.info('SIZE_DOWNLOAD'));

})