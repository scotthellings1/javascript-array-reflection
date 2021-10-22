class Photo {
  constructor(id, author, url, download_url) {
    this.id = id
    this.author = author
    this.url = url
    this.download_url = download_url
  }
}

// base url for lorem picsum
const picsumURL = 'https://picsum.photos/v2/list?page='
// Regex for checking a valid email
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
let savedEmails = {}
let imageToDisplay = null

/*-----------------
HTML Selectors
-----------------*/
const imgEl = document.querySelector('#newImage'), // new image button
 imageContainer = document.querySelector('#imageContainer'),// div that should hold the image.
 authorEl = document.querySelector('#author'),
 unsplashLinkEl = document.querySelector('#unsplashLink'),
 savePhotoBtn = document.querySelector('#saveImage'),
 cancelSavePhotoBtn = document.querySelector('#cancelSavePhoto'),
 savePhotoForm = document.querySelector('#savePhotoForm'),
 savePhotoFormBtn = document.querySelector('#savePhoto'),
 emailInput = document.querySelector('#email'),
 errorMessageBox = document.querySelector('#errorMessageBox'),
 successMessageBox = document.querySelector('#successMessageBox'),
 linkedEmailList = document.querySelector('#linkedEmailList'),
 photoForm = document.querySelector('#photoForm'),
 buttonsContainer = document.querySelector('#buttonsContainer'),
 galleryButtonsContainer = document.querySelector('#galleryButtonsContainer'),
 GalleryNewImage = document.querySelector('#GalleryNewImage'),
 gallery = document.querySelector('#gallery')


// gets a list of images from a random page with a limit of 100 items per page
const getPhoto = () => {
  const randomPage = Math.floor(Math.random() * (10) + 1)
  axios.get(`${picsumURL}${randomPage}&limit=100`)
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
  img.classList.add('lg:h-128', 'rounded-xl', 'shadow-lg', 'm-auto')
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
  let elements = [errorMessageBox, successMessageBox]
  elements.forEach(element => {
    element.innerHTML = ''
    element.classList.add('hidden')
  })
}

// get a list of the currently saved email addresses and save as an array
const listEmails = () => {
  let emails = []
  for (let email in savedEmails) {
    emails.push(email)
  }
  return emails
}


// remove the old list and update with the current list of saved emails and append each one as a li to the ul in the
// sidebar
const updateEmailList = () => {
  let newList = listEmails()

  linkedEmailList.innerHTML = ''
  for (let i = 0; i < newList.length; i++) {
    let li = document.createElement('li')
    li.classList.add('cursor-pointer', 'py-2',  'linked-email')
    li.innerHTML = `${newList[i]}<span class="pr-2 text-center ml-2 bg-blue-400 rounded-full pushy-link"> ${savedEmails[newList[i]].length}</span>`
    linkedEmailList.appendChild(li)
  }
}

// save the current photo and associate it with an email address
const saveEmail = (email) => {
  let isNewEmail = true
  let alreadyLinked = false
  for ( let savedEmail in savedEmails) {
    if (savedEmail === email) {
      isNewEmail = false
      break
    }
  }
  if (isNewEmail) {
    savedEmails[`${email}`] = [imageToDisplay]
    updateEmailList()
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
      updateEmailList()
    }
  }
}

const createGallery= () => {
  buttonsContainer.classList.add('hidden')
  gallery.classList.remove('hidden')
  galleryButtonsContainer.classList.remove('hidden')
}

const destroyGallery = () => {
  buttonsContainer.classList.remove('hidden')
  galleryButtonsContainer.classList.add('hidden')
  gallery.classList.add('hidden')
  gallery.innerHTML = ''
}

const getLinkedPhotos = (linkedEmail) => {
  let emailstr = linkedEmail.innerText
  let email = emailstr.split(" ")[0]
  const photos = savedEmails[email]

  destroyGallery()
  createGallery()
  if (photos.length === 1) {
    img = new Image()
    img.src = photos[0].download_url
    img.classList.add('w-full', 'flex-shrink', 'p-2', 'rounded-xl')
    gallery.appendChild(img)
  }
  if (photos.length === 2) {
    for (let i = 0; i <photos.length ; i++) {
      img = new Image()
      img.src = photos[i].download_url
      img.classList.add('w-full', 'md:w-1/2', 'flex-shrink', 'p-2', 'rounded-xl')
      gallery.appendChild(img)
    }
  }
  if (photos.length > 2) {
    for (let i = 0; i <photos.length ; i++) {
      img = new Image()
      img.src = photos[i].download_url
      img.classList.add('w-full', 'md:w-1/3', 'flex-shrink', 'p-2', 'rounded-xl')
      gallery.appendChild(img)
    }
  }

}

/*----------------
event listeners x
-----------------*/
// prevent the default form submission when pressing the enter key in the email field
photoForm.addEventListener('submit', (e) =>{
  e.preventDefault()
})

// add listener to enter key to submit and save the photo
  photoForm.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      savePhotoFormBtn.click();
    }
  });
linkedEmailList.addEventListener('click', (e) => {
  if (document.querySelector('#loadedImg')) {
    removeLastPhoto()
  }
  getLinkedPhotos(e.target)
})
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
  
  if (e.target === GalleryNewImage) {
    destroyGallery()
    getPhoto()
  }
  
  if (e.target === savePhotoFormBtn) {
    let isValidEmail = validateEmail(emailInput.value)
    if (!isValidEmail) {
      errorMessageBox.innerHTML = 'Please enter a valid Email'
      errorMessageBox.classList.remove('hidden')
    } else {
      errorMessageBox.classList.add('hidden')
      successMessageBox.innerHTML = 'Photo Saved!'
      successMessageBox.classList.remove('hidden')
      setTimeout(() => {
        saveEmail(emailInput.value)
        cleanUp()
      }, 2000)
    }
  }
})

