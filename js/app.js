const addNewNoteButton = document.querySelector('#btn-add')
const noteModal = document.querySelector('#add-note-modal')
const closeBtnModal = document.querySelector('#modal-title .close')
const addBtnModal = document.querySelector('#add-btn')
const editBtnModal = document.querySelector('#edit-btn')
const deleteBtnModal = document.querySelector('#delete-btn')

const searchInput = document.querySelector('#header-search input')
const titleInput = document.querySelector('#modal-form-title')
const contentInput = document.querySelector('#modal-form-content')

const circles = ['circle-red', 'circle-blue', 'circle-pink', 'circle-yellow', 'circle-green', '']

// get notes from local storage
const getSavedNotes = () => {
  const notesJSON = localStorage.getItem('notes')
  try {
    return notesJSON ? JSON.parse(notesJSON) : []
  } catch (e) {
    return []
  }
}

// get list of notes
let notes = getSavedNotes()
let currentNoteID

document.addEventListener('DOMContentLoaded', event => {
  createNotes(notes)
})

// create list of notes elements
const createNotes = (notes, list) => {
  if (list) {
    notes.forEach((note, index) => {
      createNote(note, list[index])
    })
  } else {
    notes.forEach((note, index) => {
      createNote(note, index)
    })
  }
}

const createNote = (note, index) => {
  const baseNote = document.createElement('div')
  baseNote.className = 'note shadow'
  baseNote.id = index
  const text = note.title.length > 12 ? `${note.title.substring(0, 12)}...` : note.title
  const content = note.content.length > 136 ? `${note.content.substring(0, 136)}...` : note.content
  baseNote.innerHTML = `
    <div class="note-title">
      <div class="circle ${note.tag}"></div>
      <h2>${text}</h2> 
    </div>
    <p class="note-para">
      ${content}
    </p> 
  `
  document.querySelector('#notes').appendChild(baseNote)
}

const viewNote = e => {
  if (e.target.classList.contains('note')) {
    currentNoteID = e.target.id
    getNoteByID(currentNoteID)
  } else if (e.target.classList.contains('note-title') || e.target.classList.contains('note-para')) {
    currentNoteID = e.target.parentElement.attributes.id.value
    getNoteByID(currentNoteID)
  }
}

const getNoteByID = id => {
  noteModal.style.display = 'block'
  addBtnModal.style.display = 'none'
  editBtnModal.style.display = 'inline-block'
  deleteBtnModal.style.display = 'inline-block'

  document.querySelector('#modal-title h2').innerHTML = 'Note Details'

  titleInput.value = notes[currentNoteID].title
  contentInput.value = notes[currentNoteID].content
}

document.getElementById('notes').addEventListener('click', e => {
  viewNote(e)
})

// search note based on title
searchInput.addEventListener('keyup', event => {
  const searchKey = event.target.value
  const notesToSearch = [...notes]
  const filteredNotes = notesToSearch.filter(note => note.title.includes(searchKey))

  let list = []
  notesToSearch.findIndex((note, index) => {
    if (note.title.includes(searchKey)) {
      list.push(index)
    }
  })
  if (searchKey === '') {
    list = undefined
  }
  resetNotes()
  createNotes(filteredNotes, list)
})

deleteBtnModal.addEventListener('click', e => {
  const prevNotes = [...notes]
  prevNotes.pop(currentNoteID)
  localStorage.setItem('notes', JSON.stringify(prevNotes))
  hideUI()
  resetNotes()
  notes = getSavedNotes()
  createNotes(notes)
  searchInput.value = ''
})

editBtnModal.addEventListener('click', event => {
  const noteTitle = titleInput.value
  const noteContent = contentInput.value
  const noteCircle = notes[currentNoteID].tag
  // const newNote = { title: noteTitle, content: noteContent, tag: noteCircle }
  const newNote = new Note(noteTitle, noteContent, noteCircle)
  const editedNote = [...notes]
  editedNote[currentNoteID] = newNote
  localStorage.setItem('notes', JSON.stringify(editedNote))
  hideUI()
  resetNotes()
  notes = getSavedNotes()
  createNotes(notes)

  searchInput.value = ''
})

addNewNoteButton.addEventListener('click', event => {
  noteModal.style.display = 'block'
  addBtnModal.style.display = 'block'
  document.querySelector('#modal-title h2').innerHTML = 'Add A Note'
  titleInput.value = ''
  contentInput.value = ''
})

addBtnModal.addEventListener('click', () => {
  const noteTitle = titleInput.value
  const noteContent = contentInput.value
  const randomCircle = Math.floor(Math.random() * circles.length)
  const newNote = new Note(noteTitle, noteContent, circles[randomCircle])
  notes.push(newNote)
  localStorage.setItem('notes', JSON.stringify(notes))
  createNote(newNote, notes.length - 1)

  titleInput.value = ''
  contentInput.value = ''

  noteModal.style.display = 'none'
})

// close modal if x icon is clicked
closeBtnModal.addEventListener('click', event => {
  hideUI()
})

const hideUI = () => {
  noteModal.style.display = 'none'
  editBtnModal.style.display = 'none'
  deleteBtnModal.style.display = 'none'
}

const resetNotes = () => {
  document.querySelectorAll('.note').forEach((note, index) => {
    if (index !== 0) note.remove()
  })
}

class Note {
  constructor(title, content, tag) {
    this.title = title
    this.content = content
    this.tag = tag
  }
}
