const helpers = (function helpers() {

  const NEW_NOTE_ID = 'new-note';

  function appTitle() {
    document.getElementById('app-title')
      .addEventListener('click', function onClickTitle() {
        window.location.replace('/')
      })
  }

  function getFirstWord(string) {
    if (!string) {
      return '';
    }

    const MAX_TITLE_LENGTH = 12;
    let candidate;

    const splitArray = string.split(' ');
    if (splitArray.length > 0) {
      candidate = splitArray[0];
    }

    if (candidate.length > MAX_TITLE_LENGTH) {
      candidate = candidate.substr(0, MAX_TITLE_LENGTH);
    }
    return candidate;
  }

  function renderNoteItem({ id, content, timestamp }) {
    if (!id || !timestamp) {
      throw Error('Item EMPTY or missing required value - id, timestamp');
      return;
    }

    const container = document.createElement('div');
    container.classList.add('list-item');

    // DATA ATTRIBUTE
    container.setAttribute('data-id', id);

    const heading = document.createElement('h3');
    const subheading = document.createElement('p');

    heading.innerText = getFirstWord(content);
    subheading.innerText = content;

    container.appendChild(heading)
    container.appendChild(subheading);
    return container;
  }

  function clearNotesList() {
    const listContainer = document.getElementById('notes-list-panel');
    listContainer.innerHTML = ''; //Clear the current content
    return listContainer
  }

  function addToTopNotesList(node) {
    const listContainer = document.getElementById('notes-list-panel');
    listContainer.insertBefore(node, listContainer.firstChild);
  }

  function handleClickItem(listContainer, notes) {

    listContainer.addEventListener('click', function handleNotesClick(ev) {
      const selectedID = ev.target.getAttribute('data-id');

      // Handle Empty Add new Note
      if(selectedID === NEW_NOTE_ID){
        document.querySelector(`div[data-id='${NEW_NOTE_ID}']`).classList.add('active');
      }else{
        const newNoteElement = document.querySelector(`div[data-id='${NEW_NOTE_ID}']`);
        newNoteElement &&  newNoteElement.classList.remove('active');
      }

      // Existing notes handling
      const contentContainer = document.getElementById('notes-view');
      contentContainer.innerText = '';
      notes.forEach(({ id, content, timestamp }) => {
        if (selectedID == id) {
          contentContainer.innerText = content + '\n' + timestamp;
          document.querySelector(`div[data-id='${id}']`).classList.add('active');
        } else {
          document.querySelector(`div[data-id='${id}']`).classList.remove('active');
        }
      });

    });
  }
  function renderNotesList(notes) {
    const listContainer = clearNotesList();

    handleClickItem(listContainer, notes);

    if (notes && notes.length) {
      notes.forEach(note => {
        listContainer.appendChild(renderNoteItem(note));
      });
    }
    else {
      throw Error('API result empty');
    }
  }


  function getActiveNote() {
    const activeNote = document.querySelector('div.list-item.active');

    if(activeNote){
      return activeNote.getAttribute('data-id');
    }

    return null;
  }

  function addNote() {
    document.getElementById('add-note')
      .addEventListener('click', function handleAddClick() {

        // Check if already in add mode
        if (document.querySelector(`div[data-id=${NEW_NOTE_ID}]`)) {
          console.log('ALREADY IN ADD MODE! You dummy!');
          return;
        }

        const noteListItem = renderNoteItem({
          id: NEW_NOTE_ID,
          content: '',
          timestamp: Date.now().toString()
        });

        addToTopNotesList(noteListItem);

      });
  }

  function deleteNote() {
    document.getElementById('delete-note')
      .addEventListener('click', function handleDeleteClick() {
        const activeID = getActiveNote();
        if(activeID){
          console.log('DELETE NOTE - ', activeID);
        }else{
          console.log('NO NOTE SELECTED! You dummy!');
        }
        
      });
  }
  return {
    clearNotesList,
    renderNotesList,
    addNote,
    deleteNote,
    appTitle
  }
})();

const app = (function app(helpers) {
  const { appTitle, renderNotesList, clearNotesList, addNote, deleteNote } = helpers;

  window.addEventListener('DOMContentLoaded', main, true);

  async function fetchNotes() {
    return fetch('/notes')
      .then(res => res.json())
      .catch(console.error);
  }

  async function main() {
    appTitle();
    addNote();
    deleteNote();
    clearNotesList();
    const { notes } = await fetchNotes();
    renderNotesList(notes);
  }
})(helpers);