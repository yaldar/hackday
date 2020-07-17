const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
var cors = require('cors');

// change this after deployement
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// to allow CORS
app.use(cors());

app.use(
  cors({
    origin: 'http://localhost:3000/',
  }),
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});
const SPOTIFY_CLIENT_ID = '95bcf8e141d6412c93f95c363a0a896a';
const SPOTIFY_CLIENT_SECRET = '934a620466c44587964c156f39e47f33';
const FRONTEND_URI = 'http://localhost:3000/playlist';
const REDIRECT_URI = 'http://localhost:5000/api/callback';

// app.get('/api/login/:email/:password', (req, res) => {
//   console.log(req.params.email);
//   // send to spotify API
//   // res.json({success: true or false, userID: idfromspotify})
//   res.json({success: true})
// })

///////////////////////

let request = require('request');
let querystring = require('querystring');
const { json } = require('body-parser');

let redirect_uri = REDIRECT_URI || 'http://localhost:5000/api/callback';

app.get('/api/tracks/:token', async (req, res) => {
  const token = req.params.token;

  const h = req.headers;

  const url = h.next;

  console.log(url);
  // headers: { Authorization: 'Bearer ' + token },
  let authOptions = {
    url,
    headers: { Authorization: 'Bearer ' + token },
    json: true,
  };

  request.get(authOptions, function (error, response, body) {
    console.log(response.body);
    res.json(response.body);
  });
});

app.get('/api/login', function (req, res) {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope:
          'user-read-private user-read-email user-library-modify user-library-read',
        redirect_uri,
      }),
  );
});

app.get('/api/callback', function (req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
          'base64',
        ),
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    var access_token = body.access_token;
    let uri = FRONTEND_URI || 'http://localhost:3000/playlist/';
    res.redirect(uri + '/' + access_token);
  });
});

let port = process.env.PORT || 5000;
console.log(
  `Listening on port ${port}. Go /login to initiate authentication flow.`,
);
app.listen(port);
//////////////

// this one after building
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// app.use((req, res) => {
//   res.status(404).json({ message: 'Page Not Found' });
// });
// app.use((err, req, res, next) => {
//   res
//     .status(500)
//     .json({
//       message: `Something went wrong fetching the data. Try again later. Internal server error: "${err}"`,
//     });
// });
// app.listen(process.env.PORT || 5000);
