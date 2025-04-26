// Selectors
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showDataSafe(data);
}

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

function showDataUnsafe(lyrics) {
    result.innerHTML = `
      <ul class="songs">
        ${lyrics.data
          .map(
            (song) => `<li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
      </li>`
          )
          .join('')}
      </ul>
    `;
  
    if (lyrics.prev || lyrics.next) {
      more.innerHTML = `
        ${
          lyrics.prev
            ? `<button class="btn" onclick="getMoreSongs('${lyrics.prev}')">Prev</button>`
            : ''
        }
        ${
          lyrics.next
            ? `<button class="btn" onclick="getMoreSongs('${lyrics.next}')">Next</button>`
            : ''
        }
      `;
    } else {
      more.innerHTML = '';
    }
  }
  
  function showDataSafe(lyrics) {
    result.innerHTML = '';
    more.innerHTML = '';
  
    const ul = document.createElement('ul');
    ul.className = 'songs';
  
    lyrics.data.forEach((song) => {
      const li = document.createElement('li');
  
      const span = document.createElement('span');
  
      const strong = document.createElement('strong');
      strong.textContent = song.artist.name;
  
      span.appendChild(strong);
      span.appendChild(document.createTextNode(` - ${song.title}`));
      li.appendChild(span);
  
      const button = document.createElement('button');
      button.className = 'btn';
      button.textContent = 'Get Lyrics';
      button.dataset.artist = song.artist.name;
      button.dataset.songtitle = song.title;
  
      li.appendChild(button);
      ul.appendChild(li);
    });
  
    result.appendChild(ul);
  
    if (lyrics.prev || lyrics.next) {
      if (lyrics.prev) {
        const prevButton = document.createElement('button');
        prevButton.className = 'btn';
        prevButton.textContent = 'Prev';
        prevButton.addEventListener('click', () => getMoreSongs(lyrics.prev));
        more.appendChild(prevButton);
      }
  
      if (lyrics.next) {
        const nextButton = document.createElement('button');
        nextButton.className = 'btn';
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => getMoreSongs(lyrics.next));
        more.appendChild(nextButton);
      }
    }
  }