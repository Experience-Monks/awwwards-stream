var awwwardsStream = require('./');
var test = require('tape');

test('scrape Awwwards data', function (t) {
  t.plan(12); // 12 entries per page for now :)
  awwwardsStream({
    pages: 1,
    type: 'sotd'
  }).on('data', site => {
    t.equal(typeof site.url, 'string');
  });
});
