const addBtn = document.querySelector('#btn-add')
const addNoteModal = document.querySelector('#add-note-modal')
const closeBtnModal = document.querySelector('#modal-title .close')
const addBtnModal = document.querySelector('#modal-form button')
const titleInput = document.querySelector('#modal-form-title')
const contentInput = document.querySelector('#modal-form-content')

const getSavedNotes = () => {
  const notesJSON = localStorage.getItem('notes')
  try {
    return notesJSON ? JSON.parse(notesJSON) : []
  } catch (e) {
    return []
  }
}

const notes = getSavedNotes()

addBtn.addEventListener('click', (event) => {
  addNoteModal.style.display = 'block'
})

closeBtnModal.addEventListener('click', (event) => {
  addNoteModal.style.display = 'none'
})

addBtnModal.addEventListener('click', () => {
  const noteTitle = titleInput.value
  const noteContent = contentInput.value
  const newNote = { title: noteTitle, content: noteContent }

  notes.push(newNote)
  window.localStorage.setItem('notes', JSON.stringify(notes))

  titleInput.value = ''
  contentInput.value = ''

  addNoteModal.style.display = 'none'
})
