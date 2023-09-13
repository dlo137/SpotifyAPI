import './App.css';
import albumCover from "../src/images/cover.jpg"
import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

/*============================================= AUTHORIZATION SECTIONS ============================================= */

const spotifyApi = new SpotifyWebApi();

// Replace with your own Spotify App credentials
const clientId = '98753eb9bbb74bee992a5f56e9c690be';
const clientSecret = 'd0f79534054a404a8b6ba0039387d2b8';

// Set your redirect URI in the Spotify Developer Dashboard
const redirectUri = 'http://localhost:3000';

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

/*============================================= APP SECTION  =============================================*/

function App() {
  const [recentSong, setRecentSong] = useState(null);

  useEffect(() => {
    // Check if an access token exists
    const accessTokenExists = window.location.hash.includes('access_token=');

    if (!accessTokenExists) {
      // If no access token, redirect to authorize
      authorizeSpotify();
    } else {
      // If access token is in the URL, parse it
      parseAccessToken();
      // Fetch the user's recently played tracks
      spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 })
        .then((response) => {
          const track = response.items[0].track;
          setRecentSong({
            name: track.name,
            artist: track.artists[0].name,
            albumCover: track.album.images[0].url,
          });
        })
        .catch((error) => {
          console.error('Error fetching recently played track:', error);
        });
    }
  }, []);

/*============================================= JSX/RETURN SECTION  =============================================*/

  return (
    <div className="App-Wrapper">
      <div className='Spotify-Box'>
        <div className='Album-Cover-Box'>
          {recentSong && <img src={recentSong.albumCover} alt='album cover' />}
        </div>

        <div className='Recent-Song-Artist'> 
        <p className='recently-played'>Recently Played</p>
          {recentSong && (
            <>
              <h1 className='Song-Name'>{recentSong.name}</h1>
              <p>{recentSong.artist}</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
