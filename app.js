const addBtn = document.querySelector('#btn-add')
const addNoteModal = document.querySelector('#add-note-modal')
const closeBtnModal = document.querySelector('#modal-title .close')
const addBtnModal = document.querySelector('#modal-form button')
const titleInput = document.querySelector('#modal-form-title')
const contentInput = document.querySelector('#modal-form-content')

const circles = ['circle-red', 'circle-blue', 'circle-pink', 'circle-yellow', 'circle-green']

const getSavedNotes = () => {
  const notesJSON = localStorage.getItem('notes')
  try {
    return notesJSON ? JSON.parse(notesJSON) : []
  } catch (e) {
    return []
  }
}

const createNewNoteElements = (note) => {
  baseNote = document.createElement('div')
  baseNote.className = 'note shadow'

  titleNote = document.createElement('div')
  titleNote.className = 'note-title'

  cicleTitleNote = document.createElement('div')
  cicleTitleNote.className = `circle ${note.tag}`

  textTitleNote = document.createElement('h2')
  textTitleNote.appendChild(document.createTextNode(note.title))

  titleNote.appendChild(cicleTitleNote)
  titleNote.appendChild(textTitleNote)

  contentNote = document.createElement('p')
  contentNote.appendChild(document.createTextNode(note.content))
  contentNote.className = 'note-para'

  baseNote.appendChild(titleNote)
  baseNote.appendChild(contentNote)

  document.querySelector('#notes').appendChild(baseNote)
}

const notes = getSavedNotes()

notes.forEach((note) => {
  createNewNoteElements(note)
})

addBtn.addEventListener('click', (event) => {
  addNoteModal.style.display = 'block'
})

closeBtnModal.addEventListener('click', (event) => {
  addNoteModal.style.display = 'none'
})

addBtnModal.addEventListener('click', () => {
  const noteTitle = titleInput.value
  const noteContent = contentInput.value
  const randomCircle = Math.floor(Math.random() * circles.length)
  const newNote = { title: noteTitle, content: noteContent, tag: circles[randomCircle] }

  notes.push(newNote)
  localStorage.setItem('notes', JSON.stringify(notes))
  createNewNoteElements(newNote)

  titleInput.value = ''
  contentInput.value = ''

  addNoteModal.style.display = 'none'
})
