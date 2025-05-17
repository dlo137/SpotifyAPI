import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Replace with your own Spotify App credentials
const clientId = '98753eb9bbb74bee992a5f56e9c690be';
const clientSecret = 'd0f79534054a404a8b6ba0039387d2b8';

// Set your redirect URI in the Spotify Developer Dashboard
const redirectUri = 'YOUR_REDIRECT_URI';

// Redirect the user to Spotify's authorization page
function authorizeSpotify() {
  const scopes = ['user-read-recently-played'];
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
  window.location.href = authUrl;
}

// After the user authorizes your app and is redirected back, parse the access token from the URL
function parseAccessToken() {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get('access_token');
  spotifyApi.setAccessToken(accessToken);
}

authorizeSpotify()
parseAccessToken()