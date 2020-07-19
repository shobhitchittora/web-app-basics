const helpers = (function helpers() {
  function appTitle() {
    document.getElementById('app-title')
      .addEventListener('click', function onClickTitle() {
        window.location.replace('/')
      })
  }

  function renderNoteItem({ id, title, content, lastModified }) {
    if (!id || !title || !content) {
      throw Error('ITEM EMPTY');
      return;
    }

    const container = document.createElement('div');
    container.classList.add('list-item');

    // DATA ATTRIBUTE
    container.setAttribute('data-id', id);

    const heading = document.createElement('h3');
    const subheading = document.createElement('p');

    heading.innerText = title;
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

  function handleClickItem(listContainer, notes) {

    listContainer.addEventListener('click', function handleNotesClick(ev) {
      const selectedID = ev.target.getAttribute('data-id');

      const contentContainer = document.getElementById('notes-view');
      contentContainer.innerText = '';
      notes.forEach(({ id, content, lastModified }) => {
        if (selectedID == id) {
          contentContainer.innerText = content + lastModified;
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


  function addNote() {
    document.getElementById('add-note')
      .addEventListener('click', function handleAddClick() {
        console.log('ADD NOTE');
      });
  }

  function deleteNote() {
    document.getElementById('delete-note')
      .addEventListener('click', function handleDeleteClick() {
        console.log('DELETE NOTE');
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