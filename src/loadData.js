var fs = require('fs');
var fetch = require('node-fetch');
const base = 'https://phish.in/api/v1/'

var stream = fs.createWriteStream(__dirname + '/filters.js');

const tours = async() => {
  let data = await (await fetch(base + 'tours?sort_attr=starts_on&per_page=1000')).json();
  return data.data.map(tour => {
    return {
      label: tour.name,
      value: tour.id,
      showCount: tour.shows_count
    };
  }).reverse();
}

const venues = async() => {
  let data = await (await fetch(base + 'venues?sort_attr=shows_count&sort_dir=desc&per_page=50000')).json();
  return data.data.map(venue => {
    return {
      label: venue.name,
      value: venue.id,
      showCount: venue.shows_count
    };
  });
}

const songs = async() => {
  let data = await (await fetch(base + 'songs?sort_attr=tracks_count&sort_dir=desc&per_page=50000')).json();
  return data.data.map(song => {
    return {
      label: song.title,
      value: song.alias_for ? song.alias_for : song.id
    };
  });
}

const years = async() => {
  let data = await (await fetch(base + 'years')).json();
  yearFilters = data.data.map(year => {
    return {
      label: year,
      value: year
    };
  });
  yearFilters.push({label: "All Shows", value: "all"});
  return yearFilters.reverse();
}

const trackSBD = async() => {
  let data = await (await fetch(base + 'tracks?tag=SBD&per_page=50000')).json();
  return data.data.map(track => {
    return track.id;
  });
}

const trackJams = async() => {
  let data = await (await fetch(base + 'tracks?tag=Jamcharts&per_page=50000')).json();
  return data.data.map(track => {
    return track.id;
  });
}

const showSBD = async() => {
  let data = await (await fetch(base + 'tracks?tag=Jamcharts&per_page=50000')).json();
  return data.data.map(show => {
    return show.id;
  });
}

const showJams = async() => {
  let data = await (await fetch(base + 'shows?tag=Jamcharts&per_page=50000')).json();
  return data.data.map(show => {
    return show.id;
  });
}

stream.once('open', function(fd) {
  tours().then(tours => {
    stream.write('export const tourFilters = ' + JSON.stringify(tours) + ';\n');
  });

  venues().then(venues => {
    stream.write('export const venueFilters = ' + JSON.stringify(venues) + ';\n');
  });

  songs().then(songs => {
    stream.write('export const songFilters = ' + JSON.stringify(songs) + ';\n');
  });

  years().then(years => {
    stream.write('export const yearFilters = ' + JSON.stringify(years) + ';\n');
  });

  trackSBD().then(x => {
    stream.write('export const trackSoundboards = ' + JSON.stringify(x) + ';\n');
  });

  trackJams().then(x => {
    stream.write('export const trackJamcharts = ' + JSON.stringify(x) + ';\n');
  });

  showSBD().then(x => {
    stream.write('export const showSoundboards = ' + JSON.stringify(x) + ';\n');
  });

  showJams().then(x => {
    stream.write('export const showJamcharts = ' + JSON.stringify(x) + ';\n');
  });

  stream.write('export const sortByOptions = ' + JSON.stringify([
    {label: 'Jamcharts', value: "jamcharts", attr: "jamcharts", order: "desc"},
    {label: 'Soundboard', value: "soundboard", attr: "soundboard", order: "desc"},
    {label: 'Likes', value: "popular", attr: "likes_count", order: "desc"},
    {label: 'Date (Recent)', value: "recent", attr: "date", order: "desc"},
    {label: 'Date (Older)', value: "older", attr: "date", order: "asc"},
  ]) + ';\n');
});