var awwwards = require('./');

awwwards({
  type: 'sotd', // Site of the Day
  pages: 1,
  startPage: 0
})
  .on('data', site => {
    console.log('%s: %s', site.title, site.url);
  })
  .on('end', () => {
    console.log('Finished');
  });
