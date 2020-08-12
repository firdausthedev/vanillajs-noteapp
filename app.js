const addBtn = document.querySelector('#btn-add')
const addNoteModal = document.querySelector('#add-note-modal')
const closeBtnModal = document.querySelector('#modal-title .close')
const addBtnModal = document.querySelector('#modal-form button')

addBtn.addEventListener('click', (event) => {
  addNoteModal.style.display = 'block'
})

closeBtnModal.addEventListener('click', (event) => {
  addNoteModal.style.display = 'none'
})

addBtnModal.addEventListener('click', (event) => {
  addNoteModal.style.display = 'none'
})
