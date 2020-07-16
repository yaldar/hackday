import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function Playlist() {
  const [cookie, setCookie] = useCookies();
  const [state, setState] = useState({
    tracks: [
      {
        href: '',
        name: '',
        artists: [],
        album: '',
        genres: [],
      },
    ],
  });

  const p = useParams();
  const firstUrl = 'https://api.spotify.com/v1/me/tracks';
  const token = p.access_token ? p.access_token : cookie.token;

  const fillGenres = async url => {
    const stuff = await fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
    });
    const d = await stuff.json();

    const f = d.artists.map(async el => {
      const aa = await fetch(el.href, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const adf = await aa.json();
      const asdf = adf.genres;
      return asdf;
    });

    const rrr = await f.flat(Infinity);
    console.log(rrr);
    return rrr;
  };

  const fetchLiked = url => {
    fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => res.json())
      .then(d => {
        return d.items.map(el => ({
          name: el.track.name,
          artists: [el.track.artists],
          album: el.track.album.name,
          href: el.track.href,
          genres: fillGenres(el.track.href),
        }));

        // if (d.next) {
        //   fetchLiked(d.next);
        // }
      })
      .then(async arr => {
        await setState(oldState => ({ tracks: [...oldState.tracks, ...arr] }));
      });
  };

  useEffect(() => {
    if (!cookie.token && p.access_token) {
      setCookie('token', p.access_token, { path: '/' });
    }
    setCookie('loggedin', 'yes', { path: '/' });

    if (token) {
      fetchLiked(firstUrl);
    }

    return () => {};
  }, []);
  setInterval(() => {
    console.log(state.tracks);
  }, 1000);
  const lll = state.tracks.map(el => <p>{el.name}</p>);

  return <h1>lkjk{lll}</h1>;
}
