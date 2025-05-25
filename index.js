document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = document.getElementById('word-input').value.trim();
  if (!word) return;

  clearDisplay();
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error('Word not found.');

    const data = await response.json();
    displayWord(data[0]);
  } catch (error) {
    showError(error.message);
  }
});

function displayWord(data) {
  const wordInfo = document.getElementById('word-info');
  document.getElementById('word-title').textContent = data.word;

  const phonetic = data.phonetics.find(p => p.text);
  document.getElementById('phonetic').textContent = phonetic?.text || '';

  const audio = data.phonetics.find(p => p.audio);
  if (audio && audio.audio) {
    const audioEl = document.getElementById('audio');
    audioEl.src = audio.audio;
    audioEl.classList.remove('hidden');
  }

  const defDiv = document.getElementById('definitions');
  defDiv.innerHTML = `<h3>Definitions</h3>` +
    data.meanings.map(meaning =>
      `<p><strong>${meaning.partOfSpeech}:</strong> ${meaning.definitions[0].definition}</p>`
    ).join('');

  const synonyms = data.meanings.flatMap(m => m.synonyms).filter(Boolean);
  const synDiv = document.getElementById('synonyms');
  if (synonyms.length) {
    synDiv.innerHTML = `<h3>Synonyms</h3><p>${synonyms.slice(0, 5).join(', ')}</p>`;
  }

  wordInfo.classList.remove('hidden');
}

function showError(msg) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
}

function clearDisplay() {
  document.getElementById('error-message').classList.add('hidden');
  document.getElementById('word-info').classList.add('hidden');
  document.getElementById('audio').classList.add('hidden');
}
