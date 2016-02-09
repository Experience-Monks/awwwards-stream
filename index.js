var got = require('got');
var format = require('util').format;
var defined = require('defined');
var cheerio = require('cheerio');
var urlJoin = require('url-join');
var moment = require('moment');
var from2 = require('from2');

var BASE_URL = 'http://www.awwwards.com/';
var entry = BASE_URL + '%s/?page=%d';
var types = {
  sotd: 'awards-of-the-day',
  sotm: 'awards-of-the-month',
  nominees: 'nominees',
  mentions: 'honorable-mentions',
  trending: 'websites/trend'
};

module.exports = awwwardsStream;
function awwwardsStream (opt) {
  opt = opt || {};
  var type = opt.type || 'sotd';
  if (!(type in types)) {
    throw new TypeError('invalid type ' + type);
  }
  type = types[type.toLowerCase()];

  var startPage = defined(opt.startPage, 0);
  var page = startPage;
  var pages = defined(opt.pages, Infinity);
  var rate = defined(opt.rate, 250);
  var chunks = [];

  return from2.obj(read);

  function read (size, next) {
    if (chunks.length <= 0) {
      // Grab more data...
      setTimeout(() => {
        readPage((err, data) => {
          if (err) return next(err);
          if (!data) {
            next(null, null); // no more pages
          } else {
            chunks = data.slice();
            next(null, chunks.shift());
          }
        });
      }, rate);
    } else {
      next(null, chunks.shift());
    }
  }

  function readPage (cb) {
    if (page >= (startPage + pages)) {
      cb(null, null);
      return;
    }

    var url = format(entry, type, (1 + page));
    got(url)
      .then(resp => {
        page++;
        var $ = cheerio.load(resp.body);
        var noResults = $('div.no-results');
        if (noResults.length) {
          cb(null, null); // no more pages to show
        } else {
          cb(null, parsePage($));
        }
      })
      .catch(err => cb(err));
  }

  function parsePage ($) {
    var grid = $('ul.grid.list-item');
    var items = grid.find('li');
    return items.map((i, el) => {
      el = $(el);

      var thumb = el.find('figure.rollover.site');
      var url = thumb.find('a').eq(1).attr('href');
      var thumbUrl = thumb.find('img').attr('src');
      var developerAward = Boolean(thumb.find('div.label.developer').length);

      var info = el.find('.info');
      var titleEl = info.find('h3 > a');
      var entryUrl = absoluteUrl(titleEl.attr('href'));

      var hearts = parseInt(info.find('.add-like > .total').text(), 10) || 0;
      var rows = info.find('div.row');
      var authorEl = rows.eq(0).find('a');
      var strongs = rows.eq(0).find('strong');
      var country = strongs.eq(1).text().trim();
      var rating = parseFloat(strongs.eq(2).text().trim());
      var date = parseDate(rows.eq(1).text().trim());

      var obj = {
        title: titleEl.text().trim(),
        url: url,
        thumbnail: thumbUrl,
        entry: entryUrl,
        hearts: hearts,
        author: {
          name: authorEl.text(),
          entry: absoluteUrl(authorEl.attr('href')),
          country: country
        },
        date: date,
        developerAward: developerAward
      };

      // Some sections don't show ratings
      if (isFinite(rating)) obj.rating = rating;
      return obj;
    }).get();
  }
}

function absoluteUrl (url) {
  return url ? urlJoin(BASE_URL, url) : undefined;
}

function parseDate (date) {
  return moment(date, 'MMMM DD, YYYY').format();
}
