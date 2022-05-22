async function handleSubmit(event) {
  // prevent page from reloading when form is submitted
  event.preventDefault()
  //get the value of the input field
  const inputValue = document.querySelector('.js-search-input').value;

  //remove whitespace from the input
  const searchQuery = inputValue.trim();

  const searchResults = document.querySelector('.js-search-result');

  //Clear the previous results
  searchResults.innerHTML = '';

  const spinner = document.querySelector('.js-spinner');
  spinner.classList.remove('hidden');

  try {
    const results = await searchWikipedia(searchQuery);
    if (results.query.searchinfo.totalhits === 0) {
      alert('No results found. Try different keywords');
      return;
    }

    displayResults(results);
  } catch (err) {
    console.log(err);
    alert('Failed to search Wikipedia');
  } finally {
    spinner.classList.add('hidden');
  }
}

async function searchWikipedia(searchQuery) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  return json;
}

function displayResults(results) {
  const searchResults = document.querySelector('.js-search-result');

  results.query.search.forEach(result => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

    //rel=”noopener” is an HTML attribute that’s used to address a security vulnerability which can be exploited by malicious websites.

    //The insertAdjacentHTML() method of the Element interface parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.
    searchResults.insertAdjacentHTML(
      'beforeend',
      `<div class="result-item">
        <img src="" alt="">
        <h3 class="result-title">
          <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${result.snippet}</span><br>
    </div>`
    );
  });
}

const form = document.querySelector('.js-search-form');

form.addEventListener('submit', handleSubmit);