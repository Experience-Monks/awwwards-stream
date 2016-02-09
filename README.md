# awwwards-stream

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Creates a readable stream of [Awwwards.com data](http://awwwards.com/) by scraping their HTML. 

> :warning: This is fragile and should only be used for offline experimentation / artistic purposes. It is not an official API and you should rate limit your requests to keep stress off the Awwwards servers. It may break at any point and should not be used in a live Node.js server.

## Install

```sh
npm i awwwards-stream --save
```

## Example

```js
var awwwards = require('awwwards-stream');

awwwards({
  type: 'sotd', // Site of the Day
  pages: 2,
  startPage: 0
})
  .on('data', site => {
    console.log('%s: %s', site.title, site.url)
  })
  .on('end', () => {
    console.log('Finished')
  });
```

Results (from Feb 9, 2016) –

```
Centurion-Magazine: http://centurion-magazine.com
Active Theory v3: http://activetheory.net
A Short Journey: http://www.ashortjourney.com
Tolia - The Longest Short Films: http://tolia.ge/
Make Me Pulse 2016 Wishes: http://2016.makemepulse.com
Jérémie Battaglia: http://jeremiebattaglia.com/
Do You Still Believe?: http://www.doyoustillbelieve.com/
Red Collar: http://redcollar.digital
Publicis90: http://www.publicis90.com
A State of War: http://astateofwar.org.au
Doudou Blues: http://www.doudoublues.com/
The Grey Tales: http://thegreytales.net
Finished
```

See [./example.js](./example.js) for a more practical example, finding the countries that are publishing the last 600 Sites of the Day:

```
Total sites: 600

 1. U.S.A. (131)
 2. France (129)
 3. United Kingdom (48)
 4. Netherlands (48)
 5. Denmark (24)
 6. Canada (21)
 7. Italy (21)
 8. Germany (17)
 9. Belgium (17)
10. Russia (12)

```

## Usage

[![NPM](https://nodei.co/npm/awwwards-stream.png)](https://www.npmjs.com/package/awwwards-stream)

#### `stream = awwwardsStream(opts)`

Returns a readable object stream that emits objects for each entry in the Awwwards data. Options:

- `type` (String) can be one of: `sotd, sotm, nominees, mentions, trending` – defaults to `'sotd'`
- `startPage` (Number) starting page, default 0
- `pages` (Number) total number of pages to scrape, default `Infinity`
- `rate` (Number) delay between successive requests, default 250 ms

The objects have this form:

```js
{
  title: String,            // Title of site
  url: String,              // URL of site
  thumbnail: String,        // URL of thumbnail
  entry: String,            // Site URL on Awwwards.com
  hearts: Number,           // # of hearts
  author: {                 // Agency/User/Author
    name: String,           // e.g. "Jam3"
    entry: String,          // Author URL on Awwwards.com
    country: String         // e.g. "Canada"
  },
  rating: Number|undefined, // Rating/10 or undefined
  date: String,             // a Date string for this entry
  developerAward: Boolean   // If the site has this badge
};
```

## License

MIT, see [LICENSE.md](http://github.com/Jam3/awwwards-stream/blob/master/LICENSE.md) for details.
