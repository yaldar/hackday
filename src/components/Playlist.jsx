import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import UnlinkeButton from './UnlikeButton';
export default function Playlist() {
  const [cookie, setCookie] = useCookies();
  const [state, setState] = useState({
    tracks: [],
  });

  let counter = 1;
  const p = useParams();
  const firstUrl = 'https://api.spotify.com/v1/me/tracks';
  const token = p.access_token ? p.access_token : cookie.token;
  // const firstUrl = `http://localhost:5000/api/tracks/${token}`;

  const fetchLiked = nextUrl => {
    fetch(`http://localhost:5000/api/tracks/${token}`, {
      headers: { next: nextUrl },
    })
      .then(res => res.json())
      .then(d => {
        const arr = d.items.map(el => {
          return {
            name: el.track.name,
            artists: el.track.artists[0].name,
            album: el.track.album.name,

            img: el.track.album.images[1].url,
            n: el.next,
          };
        });

        setState(oldState => ({ tracks: [...oldState.tracks, ...arr] }));
        if (d.next) {
          counter++;
          fetchLiked(d.next);
        }
      });
  };

  useEffect(async () => {
    if (!cookie.token && p.access_token) {
      setCookie('token', p.access_token, { path: '/' });
    }
    setCookie('loggedin', 'yes', { path: '/' });

    if (token) {
      await fetchLiked(firstUrl);
    }
  }, []);

  const allSongs = state.tracks.map((el, i) => {
    return (
      <div className="album">
        <h3>{el.name}</h3>
        <h4>{el.album}</h4>
        <img src={el.img}></img>
      </div>
    );
  });

  const albums = [[], [], []];
  const counts = [];

  for (let i = 0; i < state.tracks.length; i++) {
    const elem = state.tracks[i];

    if (albums[0].includes(elem.album)) {
      const index = albums[0].indexOf(elem.album);

      counts[index]++;
    } else {
      counts.push(1);
      albums[0].push(elem.album);
      albums[1].push(elem.artists);
    }
  }

  var list = [];
  for (var j = 0; j < counts.length; j++)
    list.push({
      albumCount: counts[j],
      album: albums[0][j],
      artists: albums[1][j],
    });

  list.sort(function (a, b) {
    return a.albumCount > b.albumCount
      ? -1
      : a.albumCount == b.albumCount
      ? 0
      : 1;
  });

  for (var k = 0; k < list.length; k++) {
    counts[k] = list[k].albumCount;
    albums[0][k] = list[k].album;
    albums[1][k] = list[k].artists;
  }

  const favs = (
    <h1>
      <p>
        Songs of the album "{albums[0][0]}" by "{albums[1][0]}", was your most
        recurring album. you had {counts[0]} songs from that album in your liked
        songs playlist
      </p>
      <p>
        Songs from the album "{albums[0][1]}" by "{albums[1][1]}", was your
        second favorite with {counts[1]} songs
      </p>
    </h1>
  );
  return (
    <div>
      <div className="fav-wrapper">{favs}</div>
      <div className="song-list-wrapper">{allSongs}</div>
    </div>
  );
}
