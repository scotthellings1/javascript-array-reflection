class Photo {
  constructor(id, author, url, download_url) {
    this.id = id
    this.author = author
    this.url = url
    this.download_url = download_url
  }
}

// base url for lorem picsum
const URL = 'https://picsum.photos/v2/list?page='
// Regex for checking a valid email
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
let savedEmails = {}
const savedImages = {}
let imageToDisplay = null

/*-----------------
HTML Selectors
-----------------*/
const imgEl = document.querySelector('#newImage') // new image button
const imageContainer = document.querySelector('#imageContainer') // div that should hold the image.
const authorEl = document.querySelector('#author')
const unsplashLinkEl = document.querySelector('#unsplashLink')
const savePhotoBtn = document.querySelector('#saveImage')
const cancelSavePhotoBtn = document.querySelector('#cancelSavePhoto')
const savePhotoForm = document.querySelector('#savePhotoForm')
const savePhotoFormBtn = document.querySelector('#savePhoto')
const emailInput = document.querySelector('#email')
const errorMessageBox = document.querySelector('#errorMessageBox')
const successMessageBox = document.querySelector('#successMessageBox')
// gets a list of images from a random page with a limit of 100 items per page
const getPhoto = () => {
  const randomPage = Math.floor(Math.random() * (10) + 1)
  axios.get(`${URL}${randomPage}&limit=100`)
    .then(response => {
      getRandomPhoto(response.data)
    })
}

// get 1 random image from the result of getPhoto
const getRandomPhoto = (array) => {
  const randomPhoto = Math.floor(Math.random() * (array.length - 1))
  const image = array[randomPhoto]
  const imageToDisplay = new Photo(image.id, image.author, image.url, image.download_url)
  displayImage(imageToDisplay)
  PhotoAttributes(imageToDisplay)
}

// create an img element and append it to the DOM
const displayImage = (image) => {
  const img = new Image()
  img.onload = () => {
    imageContainer.appendChild(img)
  }
  img.id = 'loadedImg'
  img.src = image.download_url
  img.classList = 'h-128 rounded-xl shadow-lg m-auto'
  imageToDisplay = image
}

// get the author and the unsplash link of the current photo
const PhotoAttributes = (image) => {
  authorEl.innerHTML = image.author
  unsplashLinkEl.setAttribute('href', image.url)
}

// check that the email input is not empty and contains a properly formatted email address
const validateEmail = (email) => {
  if (email.match(emailRegex) && email.length > 0) {
    return email
  } else {
    return false
  }
}

// remove the last image from the dom and hide the show email input if shown
const removeLastPhoto = () => {
  const lastImage = document.querySelector('#loadedImg')
  imageContainer.removeChild(lastImage)
  savePhotoForm.classList.add('hidden')
}

const cleanUp = () => {
  removeLastPhoto()
  getPhoto()
  errorMessageBox.innerHTML = ''
  errorMessageBox.classList.add('hidden')
  successMessageBox.innerHTML = ""
  successMessageBox.classList.add('hidden')
}

const saveEmail = (email) => {
  let isNewEmail = true
  let alreadyLinked = false
  for (savedEmail in savedEmails) {
    if (savedEmail === email) {
      isNewEmail = false
      break
    }
  }
  if (isNewEmail) {
    savedEmails[`${email}`] = [imageToDisplay]
  } else {
    for (let i = 0; i < savedEmails[`${email}`].length; i++) {
      if (savedEmails[`${email}`][i].id === imageToDisplay.id) {
        alreadyLinked = true
        console.log('image already linked')
        break
      }
    }
    if (!alreadyLinked) {
      savedEmails[`${email}`].push(imageToDisplay)
    }
  }
}

/*----------------
event listeners x
-----------------*/

// load the first image on page load
document.addEventListener('DOMContentLoaded', getPhoto)
// single event listener on the document for all click events. e.target applies the event to the specified element.
document.addEventListener('click', (e) => {
  // if new image button clicked get new image and remove the old image
  if (e.target === imgEl) {
    cleanUp()
  }
  // if save image button clicked remove the hidden class to show the email input
  if (e.target === savePhotoBtn) {
    savePhotoForm.classList.remove('hidden')
  }
  // if the cancel button is clicked hide the show email input
  if (e.target === cancelSavePhotoBtn) {
    savePhotoForm.classList.add('hidden')
    errorMessageBox.innerHTML = ''
    errorMessageBox.classList.add('hidden')
  }
  
  if (e.target === savePhotoFormBtn) {
    let isValidEmail = validateEmail(emailInput.value)
    if (!isValidEmail) {
      errorMessageBox.innerHTML = 'Please enter a valid Email'
      errorMessageBox.classList.remove('hidden')
      console.log('not valid email')
    } else {
      
      successMessageBox.innerHTML = 'Photo Saved!'
      successMessageBox.classList.remove('hidden')
      setTimeout(() => {
        saveEmail(emailInput.value)
        cleanUp()
      }, 2000)
      
    }
  }
})

