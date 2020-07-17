import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import UnlinkeButton from './UnlikeButton';
export default function Playlist() {
  const [cookie, setCookie] = useCookies();

  const [update, setUpdate] = useState(false);

  let occ = [];
  let acc = [];
  const [state, setState] = useState({
    tracks: [
      {
        href: '',
        name: '',
        artists: [],
        album: '',
        img: '',
      },
    ],
  });

  let counter = 1;
  const p = useParams();
  const firstUrl = 'https://api.spotify.com/v1/me/tracks';
  const token = p.access_token ? p.access_token : cookie.token;

  const fetchLiked = url => {
    fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => res.json())
      .then(d => {
        return d.items.map(el => {
          if (d.next && counter < 10) {
            counter++;
            fetchLiked(d.next);
          }
          return {
            name: el.track.name,
            artists: [el.track.artists],
            album: el.track.album.name,
            href: el.track.href,
            img: el.track.album.images[1].url,
          };
        });
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

  let newS = 0;
let oldS = 0;
  const lll = state.tracks.map(el => {
    if (!occ.includes(el.album)) {
      occ.push(el.album);
      acc.push(1);
newS++

    } else {
      let index = occ.indexOf(el.name);

      acc[index] += 1;
      oldS++

    }

    return (
      <div>
        <h3>{el.name}</h3>
        <h4>{el.album}</h4>
        <img src={el.img}></img>
      </div>
    );
  });

  //1) combine the arrays:

  const sss = () => {
    var list = [];
    for (var j = 0; j < occ.length; j++)
      list.push({ name: occ[j], age: acc[j] });

    //2) sort:
    list.sort(function (a, b) {
      return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
      //Sort could be modified to, for example, sort on the age
      // if the name is the same.
    });

    let newArr1 = [];
    let newArr2 = [];
    //3) separate them back out:
    for (var k = 0; k < list.length; k++) {
      // occ[k]
      newArr1 = list[k].name;
      // acc[k]
      newArr2 = list[k].age;
    }

    return list
  };


  const obj = sss();

  console.log('new', newS);
  console.log('old', oldS);
  // console.log(obj);

  // const favs = (
  //   <h1>
  //     <p>
  //       your fav was {obj.one[1]} you listened to it {obj.two[1]} times
  //     </p>
  //     <p>
  //       your 2nd fav was {obj.one[2]} you listened to it {obj.two[1]} times
  //     </p>
  //   </h1>
  // );
  return (
    <div className="song-list">

      {lll}
    </div>
  );
}
