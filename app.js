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
  } catch {
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
  const text = note.title.length > 12 ? `${note.title.substring(0, 12)}...` : note.title

  textTitleNote.appendChild(document.createTextNode(text))

  titleNote.appendChild(cicleTitleNote)
  titleNote.appendChild(textTitleNote)

  contentNote = document.createElement('p')
  const content = note.content.length > 136 ? `${note.content.substring(0, 136)}...` : note.content
  contentNote.appendChild(document.createTextNode(content))
  contentNote.className = 'note-para'

  baseNote.appendChild(titleNote)
  baseNote.appendChild(contentNote)

  document.querySelector('#notes').appendChild(baseNote)
}

const notes = getSavedNotes()

notes.forEach((note) => {
  createNewNoteElements(note)
})

const setListenerOnNote = () => {
  const noteSelected = document.querySelectorAll('.note')
  noteSelected.forEach((note, index) => {
    note.addEventListener('click', (event) => {
      if (index !== 0) {
        addNoteModal.style.display = 'block'
        addBtnModal.style.display = 'none'
        document.querySelector('#modal-title h2').innerHTML = 'Note Details'
        titleInput.value = notes[index - 1].title
        contentInput.value = notes[index - 1].content
      }
    })
  })
}

document.addEventListener('DOMContentLoaded', (event) => {
  setListenerOnNote()
})

addBtn.addEventListener('click', (event) => {
  addNoteModal.style.display = 'block'
  addBtnModal.style.display = 'block'
  document.querySelector('#modal-title h2').innerHTML = 'Add A Note'
  titleInput.value = ''
  contentInput.value = ''
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
  setListenerOnNote()
})
