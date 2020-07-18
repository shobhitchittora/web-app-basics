const helpers = (function helpers() {
  function appTitle() {
    document.getElementById('app-title')
      .addEventListener('click', function onClickTitle() {
        window.location.replace('/')
      })
  }

  function renderNoteItem({ id, title, content }) {
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

  function renderNotesList(notes) {
    const listContainer = document.getElementById('notes-list-panel');
    listContainer.innerHTML = ''; //Clear the current content

    listContainer.addEventListener('click', function handleNotesClick(ev) {
      const id = ev.target.getAttribute('data-id');

      const contentContainer = document.getElementById('notes-view');
      contentContainer.innerText = '';
      contentContainer.innerText = notes.filter(({ id: ID }) => id == ID)[0].content;
    });

    if (notes && notes.length) {
      notes.forEach(note => {
        listContainer.appendChild(renderNoteItem(note));
      });
    }
    else {
      throw Error('API result empty');
    }
  }

  return {
    renderNotesList,
    appTitle
  }
})();

const app = (function app(helpers) {
  const { appTitle, renderNotesList } = helpers;

  window.addEventListener('DOMContentLoaded', main, true);

  function fetchNotes() {
    fetch('/notes')
      .then(res => res.json())
      .then(({ notes }) => {
        renderNotesList(notes);
      })
      .catch(console.error);
  }

  function main() {
    appTitle();
    fetchNotes();
  }
})(helpers);