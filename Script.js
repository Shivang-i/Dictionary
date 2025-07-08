const searchInput = document.getElementById('search-input');
const btn = document.querySelector('button');
const dictionary = document.getElementById('maincard');

const recentSearchContainer = document.getElementById("recentCardContainer"); // ✅ your container
const recentTemplate = document.getElementById("recentSearchCardTemplate"); // ✅ your template


btn.addEventListener('click', () => fetchAndCreateCard());
window.addEventListener('load', () => fetchAndCreateCard("Hello"));

async function fetchAndCreateCard(word) {
    const query = word || searchInput.value.trim();

    if (!query) {
        alert('Please enter a word!');
        return;
    }

    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
        const data = await res.json();

        if (data.title === "No Definitions Found") {
            dictionary.innerHTML = `<p>No definition found for "${query}". Try another word.</p>`;
            return;
        }

        const entry = data[0];
        const meanings = entry.meanings;

        let allDefinitions = '';
        let allExamples = '';
        let allPartsOfSpeech = '';

        meanings.forEach((meaning) => {
            allPartsOfSpeech += `${meaning.partOfSpeech}, `;

            meaning.definitions.forEach((def, i) => {
                allDefinitions += `${i + 1}. ${def.definition}\n`;
                if (def.example) {
                    allExamples += `- ${def.example}\n`;
                }
            });
        });

        // Remove trailing commas/newlines
        allPartsOfSpeech = allPartsOfSpeech.replace(/,\s*$/, '');
        allDefinitions = allDefinitions.trim();
        allExamples = allExamples.trim();

        // Update your original card structure
        dictionary.innerHTML = `
            <h3 class="word">${entry.word}</h3>
            <br>
            <p class="pronunciation">${entry.phonetic || 'N/A'}</p>
            <br>
            <p class="Defination">${allDefinitions.replace(/\n/g, '<br>')}</p>
            <br>
            <p class="partofspeech">${allPartsOfSpeech}</p>
            <br>
            <p class="example">${allExamples ? allExamples.replace(/\n/g, '<br>') : 'No examples available.'}</p>
            <br>
        `;

        // searchInput.value = query;
        saveToRecent(entry.word, allDefinitions);

    } catch (error) {
        console.error('Error fetching word:', error);
        dictionary.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
    }
}

function saveToRecent(word, definition) {
  let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

  recent = recent.filter(item => item.word.toLowerCase() !== word.toLowerCase());
  recent.unshift({ word, definition });

  if (recent.length > 5) {
    recent = recent.slice(0, 5);
  }

  localStorage.setItem("recentSearches", JSON.stringify(recent));
  renderRecent();
}

function renderRecent() {
  const recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

  // Clear old cards
  recentSearchContainer.innerHTML = "";

  recent.forEach(item => {
    const clone = recentTemplate.content.cloneNode(true);
    clone.querySelector('.recentword').textContent = item.word;
    clone.querySelector('.recentsearchdescription').textContent = 
      item.definition.length > 100 ? item.definition.slice(0, 100) + '...' : item.definition;

    clone.querySelector('.recentsearchcard').onclick = () => {
      searchInput.value = item.word;
      fetchAndCreateCard(item.word);
    };

    recentSearchContainer.appendChild(clone);
  });
}

///
// const searchInput = document.getElementById('search-input');
// const btn = document.querySelector('button');
// const dictionary = document.getElementById('maincard');
// const recentSearchContainer = document.getElementById("recentCardContainer"); // ✅ your container
// const recentTemplate = document.getElementById("recentSearchCardTemplate"); // ✅ your template

// btn.addEventListener('click', () => fetchAndCreateCard());
// window.addEventListener('load', () => {
//   fetchAndCreateCard("Hello");
//   renderRecent();
// });

// async function fetchAndCreateCard(word) {
//   const query = word || searchInput.value.trim();

//   if (!query) {
//     alert('Please enter a word!');
//     return;
//   }

//   try {
//     const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
//     const data = await res.json();

//     if (data.title === "No Definitions Found") {
//       dictionary.innerHTML = `<p>No definition found for "${query}". Try another word.</p>`;
//       return;
//     }

//     const entry = data[0];
//     const meanings = entry.meanings;

//     let allDefinitions = '';
//     let allExamples = '';
//     let allPartsOfSpeech = '';

//     meanings.forEach((meaning) => {
//       allPartsOfSpeech += `${meaning.partOfSpeech}, `;

//       meaning.definitions.forEach((def, i) => {
//         allDefinitions += `${i + 1}. ${def.definition}\n`;
//         if (def.example) {
//           allExamples += `- ${def.example}\n`;
//         }
//       });
//     });

//     allPartsOfSpeech = allPartsOfSpeech.replace(/,\s*$/, '');
//     allDefinitions = allDefinitions.trim();
//     allExamples = allExamples.trim();

//     dictionary.innerHTML = `
//       <h3 class="word">${entry.word}</h3>
//       <br>
//       <p class="pronunciation">${entry.phonetic || 'N/A'}</p>
//       <br>
//       <p class="Defination">${allDefinitions.replace(/\n/g, '<br>')}</p>
//       <br>
//       <p class="partofspeech">${allPartsOfSpeech}</p>
//       <br>
//       <p class="example">${allExamples ? allExamples.replace(/\n/g, '<br>') : 'No examples available.'}</p>
//       <br>
//     `;

//     saveToRecent(entry.word, allDefinitions);

//   } catch (error) {
//     console.error('Error fetching word:', error);
//     dictionary.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
//   }
// }

// function saveToRecent(word, definition) {
//   let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

//   recent = recent.filter(item => item.word.toLowerCase() !== word.toLowerCase());
//   recent.unshift({ word, definition });

//   if (recent.length > 5) {
//     recent = recent.slice(0, 5);
//   }

//   localStorage.setItem("recentSearches", JSON.stringify(recent));
//   renderRecent();
// }

// function renderRecent() {
//   const recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

//   // Clear old cards
//   recentSearchContainer.innerHTML = "";

//   recent.forEach(item => {
//     const clone = recentTemplate.content.cloneNode(true);
//     clone.querySelector('.recentword').textContent = item.word;
//     clone.querySelector('.recentsearchdescription').textContent = 
//       item.definition.length > 100 ? item.definition.slice(0, 100) + '...' : item.definition;

//     clone.querySelector('.recentsearchcard').onclick = () => {
//       searchInput.value = item.word;
//       fetchAndCreateCard(item.word);
//     };

//     recentSearchContainer.appendChild(clone);
//   });
// }
