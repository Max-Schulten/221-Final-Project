/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const SpotifyWebAPI = require('spotify-web-api-node');
const cors = require('cors');
const path = require('path')
const process = require('process')


const clientid = process.env.CLIENT_ID
const secret = process.env.CLIENT_SECRET
const redirecturi = process.env.REDIRECT_URI

const scopes = [
  'user-top-read',
  'user-library-read'
]

var spotifyAPI = new SpotifyWebAPI({
  clientId: clientid,
  clientSecret: secret,
  redirectUri: redirecturi
})

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use environment variable for production
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/login', async (req, res) => {
  const url = await spotifyAPI.createAuthorizeURL(scopes)
  res.redirect(url);
})

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
})


app.get('/callback', async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  // eslint-disable-next-line no-unused-vars
  const state = req.query.state;
  

  if(error) {
    console.error('Callback Err:', error);
    res.send('Callback Err:', error)
    return;
  }

spotifyAPI
  .authorizationCodeGrant(code)
  .then(data => {
    const access_token = data.body['access_token'];
    const refresh_token = data.body['refresh_token'];
    const expires_in = data.body['expires_in']

    spotifyAPI.setAccessToken(access_token)
    spotifyAPI.setRefreshToken(refresh_token)

    console.log('access_token:', access_token)
    console.log('refresh_token:', refresh_token);

    console.log('Expires in:', expires_in)
    
    res.send('Success, please close this window.')
    
    setInterval(async () => {
      const data = await spotifyAPI.refreshAccessToken();
      const access_token = data.body['access_token']

      spotifyAPI.setAccessToken(access_token);

      const user = await spotifyAPI.getMe()
      console.log(user.body)
    }, expires_in /2 *1000)

  })
  .catch(error=> {
    console.error("Error getting token:", error)
    res.send("Error getting token:", error)
  })
})

app.get('/fetch', async (req, res) => {
  const user = {}
    const topTracks = await spotifyAPI.getMyTopTracks({limit:50}).catch((error)=> {
      console.error(error);
      res.status(500).send("Failed to fetch top tracks");});
    const topArtists = await spotifyAPI.getMyTopArtists({limit:50}).catch((error) => {
      console.error(error);
      res.status(500).send("Failed to fetch top artists")
    })
    user.topArtists = await topArtists.body
    user.topTracks = await topTracks.body
    res.send(user);
})


const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));