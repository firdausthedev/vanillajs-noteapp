/*jshint esversion: 8 */
const addNewNoteButton = document.querySelector('#btn-add')
const noteModal = document.querySelector('#add-note-modal')
const closeBtnModal = document.querySelector('#modal-title .close')
const addBtnModal = document.querySelector('#add-btn')
const editBtnModal = document.querySelector('#edit-btn')
const deleteBtnModal = document.querySelector('#delete-btn')

const titleInput = document.querySelector('#modal-form-title')
const contentInput = document.querySelector('#modal-form-content')

class UI {
  // Show Note Modal
  showNoteModal() {
    noteModal.style.display = 'block'
  }

  // Close Note Modal
  closeNoteModal() {
    noteModal.style.display = 'none'
    titleInput.value = ''
    contentInput.value = ''
    addBtnModal.style.display = 'block'
    editBtnModal.style.display = 'none'
    deleteBtnModal.style.display = 'none'
  }

  // Create newly added note
  createNote(note) {
    const baseNote = document.createElement('div')
    baseNote.className = 'note shadow'
    baseNote.id = note.id
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

  // View a single note
  viewNote(e) {
    if (e.target.classList.contains('note')) {
      currentId = e.target.id
    } else if (e.target.classList.contains('note-title') || e.target.classList.contains('note-para')) {
      currentId = e.target.parentElement.attributes.id.value
    }
    console.log(currentId)
    noteModal.style.display = 'block'
    addBtnModal.style.display = 'none'
    editBtnModal.style.display = 'inline-block'
    deleteBtnModal.style.display = 'inline-block'
    document.querySelector('#modal-title h2').innerHTML = 'Note Details'

    try {
      titleInput.value = notes.notes[currentId].title
      contentInput.value = notes.notes[currentId].content
    } catch (error) {
      const prevNotes = [...notes.notes]
      const filteredNotes = prevNotes.filter(note => note.id == currentId)
      titleInput.value = filteredNotes[0].title
      contentInput.value = filteredNotes[0].content
    }
  }

  // Search from note's title
  searchInput(e) {
    console.log(e.target.value)
    const searchKey = e.target.value
    const prevNotes = [...notes.notes]
    const filteredNotes = prevNotes.filter(note => note.title.includes(searchKey))

    let list = []
    prevNotes.findIndex((note, index) => {
      if (note.title.includes(searchKey)) {
        list.push(index)
      }
    })
    if (searchKey === '') {
      list = undefined
    }
    this.resetNotes()
    this.loadNotes(filteredNotes, list)
  }

  // Remove deleted notes
  resetNotes() {
    document.querySelectorAll('.note').forEach((note, index) => {
      if (index !== 0) note.remove()
    })
  }

  // Load notes from list
  loadNotes(notes, list) {
    if (list) {
      notes.forEach((note, index) => {
        this.createNote(note, list[index])
      })
    } else {
      notes.forEach((note, index) => {
        this.createNote(note, index)
      })
    }
  }

  // Close menu
  closeMenu() {
    document.querySelector('.menu-wrap .toggler').checked = false
    if (!document.querySelector('.menu-wrap .toggler').checked) {
      document.querySelector('.menu').style.width = '0px'
      document.querySelector('.container').style.margin = 'auto'
    }
  }

  // Open Menu
  openMenu() {
    document.querySelector('.menu').style.width = '350px'
    document.querySelector('.container').style.margin = 'auto auto auto 350px'
  }
}

class Note {
  constructor(title, content, tag, id) {
    this.title = title
    this.content = content
    this.tag = tag
    this.id = id
  }
}

class Notes {
  constructor(notes) {
    this.notes = notes
  }

  // Add a single note to the notes list
  addNote() {
    const title = titleInput.value
    const content = contentInput.value
    const randomTag = tags[Math.floor(Math.random() * (tags.length + 1))]
    const id = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)

    const note = new Note(title, content, randomTag, id)
    this.notes.push(note)
    localStorage.setItem('notes', JSON.stringify(this.notes))
    ui.createNote(note)
    ui.closeNoteModal()
  }

  // Edit a single note
  editNote() {
    const noteTitle = titleInput.value
    const noteContent = contentInput.value
    const prevNotes = [...this.notes]
    const editedNotes = prevNotes.map(note => {
      if (note.id == currentId) {
        note.title = noteTitle
        note.content = noteContent
        return note
      } else {
        return note
      }
    })

    this.updateNotes(editedNotes)
  }

  // Delete a single note
  deleteNote() {
    const prevNotes = [...this.notes]
    const filteredNotes = prevNotes.filter(note => note.id != currentId)
    this.updateNotes(filteredNotes)
  }

  // Update note list and ui
  updateNotes(notes) {
    document.querySelector('#header-search input').value = ''
    localStorage.setItem('notes', JSON.stringify(notes))
    this.notes = Notes.getSavedNotes()
    ui.closeNoteModal()
    ui.resetNotes()
    ui.loadNotes(this.notes)
  }

  // get notes from local storage
  static getSavedNotes() {
    const notesJSON = localStorage.getItem('notes')
    try {
      return notesJSON ? JSON.parse(notesJSON) : []
    } catch (e) {
      return []
    }
  }
}

const ui = new UI()
const notes = new Notes(Notes.getSavedNotes())
const tags = ['circle-red', 'circle-blue', 'circle-pink', 'circle-yellow', 'circle-green']
let currentId // used when user view and edit single note

// DOM loaded
document.addEventListener('DOMContentLoaded', event => {
  ui.loadNotes(notes.notes)
})

// Add note is clicked
document.querySelector('#btn-add').addEventListener('click', e => {
  ui.showNoteModal()
})

// Close button in note modal is clicked
document.querySelector('#modal-title .close').addEventListener('click', e => {
  ui.closeNoteModal()
})

// Add note inside note modal is clicked
document.querySelector('#buttons #add-btn').addEventListener('click', e => {
  notes.addNote()
})

// A note is clicked
document.querySelector('#notes').addEventListener('click', e => {
  ui.viewNote(e)
})

// Save button inside note modal is clicked
document.querySelector('#edit-btn').addEventListener('click', e => {
  notes.editNote()
})

// Delete button inside note modal is clicked
document.querySelector('#delete-btn').addEventListener('click', e => {
  notes.deleteNote()
})

// Search input
document.querySelector('#header-search input').addEventListener('keyup', e => {
  ui.searchInput(e)
})

// menu button is clicked
document.querySelector('.menu-wrap .toggler').addEventListener('click', e => {
  if (e.target.checked) {
    ui.openMenu()
  } else {
    ui.closeMenu()
  }
})

// menu sidebar close button is clicked
document.querySelector('.menu .close-btn').addEventListener('click', e => {
  ui.closeMenu()
})
