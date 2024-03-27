// Client ID fornecido pelo Spotify Developer Dashboard
const clientId = 'c5d3988c8fef4851b918e7f2b412e713';
// URL de redirecionamento configurada no Spotify Developer Dashboard
const redirectUri = 'https://spotify-three-sandy.vercel.app/';
// Escopos de permissão necessários
const scopes = 'user-top-read';


document.getElementById('login-button').addEventListener('click', () => {
  window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}&response_type=token`;
});

// Função para extrair parâmetros da URL
function getParamsFromUrl() {
  const params = {};
  const queryString = window.location.hash.substring(1);
  const urlParams = new URLSearchParams(queryString);
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

window.onload = function() {
  const params = getParamsFromUrl();
  if (params.access_token) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('top-tracks').style.display = 'block';
    fetchTopTracks(params.access_token);
  }
}

function fetchTopTracks(accessToken) {
  fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const tracksList = document.getElementById('tracks-list');
    data.items.forEach(item => {
      const trackName = item.name;
      const artists = item.artists.map(artist => artist.name).join(', ');
      const listItem = document.createElement('li');
      listItem.textContent = `${trackName} - ${artists}`;
      tracksList.appendChild(listItem);
    });
  })
  .catch(error => console.error('Error fetching top tracks:', error));
}