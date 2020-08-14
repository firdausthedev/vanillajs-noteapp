const addNewNoteButton = document.querySelector('#btn-add')
const noteModal = document.querySelector('#add-note-modal')
const closeBtnModal = document.querySelector('#modal-title .close')
const addBtnModal = document.querySelector('#add-btn')
const editBtnModal = document.querySelector('#edit-btn')
const deleteBtnModal = document.querySelector('#delete-btn')

const searchInput = document.querySelector('#header-search input')
const titleInput = document.querySelector('#modal-form-title')
const contentInput = document.querySelector('#modal-form-content')

const circles = ['circle-red', 'circle-blue', 'circle-pink', 'circle-yellow', 'circle-green']

document.addEventListener('DOMContentLoaded', (event) => {
  createNotes(notes)
})

// get notes from local storage
const getSavedNotes = () => {
  const notesJSON = localStorage.getItem('notes')
  try {
    return notesJSON ? JSON.parse(notesJSON) : []
  } catch {
    return []
  }
}

// get list of notes
const notes = getSavedNotes()

// create list of notes elements
const createNotes = (notes, list) => {
  if (list) {
    notes.forEach((note, index) => {
      createNewNote(note, list[index])
    })
  } else {
    notes.forEach((note, index) => {
      createNewNote(note, index)
    })
  }

  setListenerOnNote(notes)
}

// create note elements
const createNewNote = (note, index) => {
  baseNote = document.createElement('div')
  baseNote.className = 'note shadow'
  baseNote.id = index

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

// set onclick listener to every note
const setListenerOnNote = (currentNotes) => {
  const noteSelected = document.querySelectorAll('.note')
  noteSelected.forEach((note, index) => {
    note.addEventListener('click', (event) => {
      if (index !== 0) {
        const id = note.id
        noteModal.style.display = 'block'
        addBtnModal.style.display = 'none'
        editBtnModal.style.display = 'inline-block'
        deleteBtnModal.style.display = 'inline-block'

        document.querySelector('#modal-title h2').innerHTML = 'Note Details'

        titleInput.value = currentNotes[index - 1].title
        contentInput.value = currentNotes[index - 1].content

        editBtnModal.addEventListener('click', (event) => {
          editNoteByIndex(notes, id)
        })

        deleteBtnModal.addEventListener('click', (event) => {
          deleteNoteByIndex(notes, id)
        })
      }
    })
  })
}

const deleteNoteByIndex = (notes, id) => {
  const prevNotes = [...notes]
  prevNotes.pop(id)
  localStorage.setItem('notes', JSON.stringify(prevNotes))
  hideUI()
  location.reload()
}

const editNoteByIndex = (notes, id) => {
  const noteTitle = titleInput.value
  const noteContent = contentInput.value
  const noteCircle = notes[id].tag
  const newNote = { title: noteTitle, content: noteContent, tag: noteCircle }
  const editedNote = [...notes]
  editedNote[id] = newNote
  localStorage.setItem('notes', JSON.stringify(editedNote))
  hideUI()
  location.reload()
}

addNewNoteButton.addEventListener('click', (event) => {
  noteModal.style.display = 'block'
  addBtnModal.style.display = 'block'
  document.querySelector('#modal-title h2').innerHTML = 'Add A Note'
  titleInput.value = ''
  contentInput.value = ''
})

// close modal if x icon is clicked
closeBtnModal.addEventListener('click', (event) => {
  hideUI()
})

addBtnModal.addEventListener('click', () => {
  const noteTitle = titleInput.value
  const noteContent = contentInput.value
  const randomCircle = Math.floor(Math.random() * circles.length)
  const newNote = { title: noteTitle, content: noteContent, tag: circles[randomCircle] }

  notes.push(newNote)
  localStorage.setItem('notes', JSON.stringify(notes))
  createNewNote(newNote)

  titleInput.value = ''
  contentInput.value = ''

  noteModal.style.display = 'none'
  setListenerOnNote(notes)
})

// search note based on title
searchInput.addEventListener('keyup', (event) => {
  const searchKey = event.target.value
  const notesToSearch = [...notes]
  const filteredNotes = notesToSearch.filter((note) => note.title.includes(searchKey))
  var list = []
  notesToSearch.findIndex((note, index) => {
    if (note.title.includes(searchKey)) {
      list.push(index)
    }
  })
  if (searchKey === '') {
    list = undefined
  }

  document.querySelectorAll('.note').forEach((note, index) => {
    if (index !== 0) note.remove()
  })

  createNotes(filteredNotes, list)
})

// // closes modal if modal background is clicked
// noteModal.addEventListener('click', (event) => {
//   if (event.srcElement.id === 'add-note-modal') hideUI()
// })

// hides modal and buttons
const hideUI = () => {
  noteModal.style.display = 'none'
  editBtnModal.style.display = 'none'
  deleteBtnModal.style.display = 'none'
}
