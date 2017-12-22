import {AsyncStorage} from 'react-native';
const base = 'https://phish.in/api/v1/'

// var myHeaders = new Headers();

// myHeaders.append('Content-Type', 'application/json');


export const login = async() => {
  fetch('http://phish.in/api/v1/users/sign_in', {
    method: 'POST',
    mode: 'no-cors',
    origin: "https://google.com",
    cache: 'default',
    body: JSON.stringify({user: {email: email, password: password} })
  }).then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
}

export const randomShow = async() => {
  let data = await (await cachedFetch(base + 'random-show')).json();
  return data.data;
}

export const show = async(id) => {
  let data = await (await cachedFetch(base + 'shows/' + id)).json();
  return data.data;
}

export const testFunc = async() => {
  let data = await (await fetch(base + 'songs?per_page=1000&sort_attr=title')).json();
  return data.data;
}

export const shows = async(page = 1) => {
  let data = await (await cachedFetch(base + 'shows?sort_attr=date&sort_dir=desc&per_page=30&page=' + page)).json();
  return data.data;
}

export const tracksForSong = async(track) => {
  let data = await (await cachedFetch(base + 'songs/' + track)).json();
  return data.data.tracks;
}

export const showsForVenue = async(venue) => {
  let data = await (await cachedFetch(base + 'venues/' + venue)).json();
  return data.data.show_ids;
}

export const showsForYear = async(year) => {
  let data = await (await cachedFetch(base + 'years/' + year)).json();
  return data.data;
}

export const showsForTour = async(tour) => {
  let data = await (await cachedFetch(base + 'tours/' + tour)).json();
  return data.data.shows;
}

export const showsToday = async(day) => {
  let data = await (await cachedFetch(base + 'shows-on-day-of-year/' + day)).json();
  return data.data;
}

export const years = async() => {
  let data = await (await cachedFetch(base + 'years')).json();
  return data.data;
}

export const tours = async() => {
  let data = await (await cachedFetch(base + 'tours?sort_attr=starts_on&per_page=1000')).json();
  return data.data;
}

export const venues = async() => {
  let data = await (await cachedFetch(base + 'venues?per_page=1000&sort_attr=shows_count&sort_dir=desc')).json();
  return data.data;
}

export const tracks = async() => {
  let data = await (await cachedFetch(base + 'tracks')).json();
  return data.data;
}

export const search = async(query) => {
  let data = await (await fetch(base + 'search/' + query)).json();

  let terms = [];

  if (!data.data) {
    return terms;
  }

  let show = data.data.show;
  if (show) {
    show.path = '/show/' + show.id;
    show.type = 'show';
    show.display = show.date + " " + show.venue_name + " " + show.location;    
    terms.push(show);
  }

  let otherShows = data.data.other_shows;
  if (otherShows) {
    Object.keys(otherShows).forEach(function(show) {
      let values = otherShows[show];
      values.path = '/show/' + values.id;
      values.type = 'show';
      values.display = values.date + " " + values.venue_name + " " + values.location;
      terms.push(values);
    });
  }

  let songs = data.data.songs;
  if (songs) {
    Object.keys(songs).forEach(function(song) {
      let values = songs[song];
      values.type = 'song';
      values.display = values.title;
      if (values.alias_for) {
        values.path = '/song/' + values.alias_for;
      } else {
        values.path = '/song/' + values.id;
      }
      terms.push(values);
    });
  }

  let tours = data.data.tours;
  if (tours) {
    Object.keys(tours).forEach(function(tour) {
      let values = tours[tour];
      values.path = '/shows/tour/' + values.id;
      values.type = 'tour';
      values.display = values.name;
      terms.push(values);
    });
  }

  let venues = data.data.venues;
  if (venues) {
    Object.keys(venues).forEach(function(venue) {
      let values = venues[venue];
      values.path = '/shows/venue/' + values.id;
      values.type = 'venue';
      if (values.past_names) {
        values.display = values.name + " " + values.location + " (" + values.past_names + ")";
      } else {
        values.display = values.name + " " + values.location;
      }
      terms.push(values);
    });
  }

  return terms;
}

const cachedFetch = (url, options) => {
  let expiry = 5 * 60 // 5 min default
  if (typeof options === 'number') {
    expiry = options
    options = undefined
  } else if (typeof options === 'object') {
    // I hope you didn't set it to 0 seconds
    expiry = options.seconds || expiry
  }
  
  // Use the URL as the cache key to sessionStorage
  let cacheKey = url
  let cached = AsyncStorage.getItem(cacheKey)
  let whenCached = AsyncStorage.getItem(cacheKey + ':ts')
  if (cached !== null && whenCached !== null) {
    // it was in sessionStorage! Yay!
    // Even though 'whenCached' is a string, this operation
    // works because the minus sign converts the
    // string to an integer and it will work.
    let age = (Date.now() - whenCached) / 1000
    if (age < expiry) {
      let response = new Response(new Blob([cached]))
      return Promise.resolve(response)
    } else {
      // We need to clean up this old key
      AsyncStorage.removeItem(cacheKey)
      AsyncStorage.removeItem(cacheKey + ':ts')
    }
  }

  return fetch(url, options).then(response => {
    // let's only store in cache if the content-type is
    // JSON or something non-binary
    if (response.status === 200) {
      let ct = response.headers.get('Content-Type')
      if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
        // There is a .json() instead of .text() but
        // we're going to store it in sessionStorage as
        // string anyway.
        // If we don't clone the response, it will be
        // consumed by the time it's returned. This
        // way we're being un-intrusive.
        response.clone().text().then(content => {
          AsyncStorage.setItem(cacheKey, content)
          AsyncStorage.setItem(cacheKey+':ts', Date.now().toString())
        })
      }
    }
    return response
  })
}