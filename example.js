var awwwards = require('./');
var padLeft = require('pad-left');

var sites = [];

awwwards({
  type: 'sotd', // Site of the Day
  pages: 50,
  rate: 50
})
  .on('data', site => {
    sites.push(site);
  })
  .on('end', frequencies);

function frequencies () {
  console.log('Total sites: %d\n', sites.length);

  var freqs = sites
    .map(site => site.author.country)
    .reduce((dict, key) => {
      if (key in dict) dict[key]++;
      else dict[key] = 1;
      return dict;
    }, {});

  var result = Object.keys(freqs).map(k => {
    return { key: k, frequency: freqs[k] };
  });

  result.sort((a, b) => b.frequency - a.frequency);

  var digits = String(result.length).length;
  result.slice(0, 10).forEach((d, i) => {
    var num = padLeft((1 + i), digits, ' ');
    console.log('%s. %s (%s)', num, d.key, d.frequency);
  });
}
