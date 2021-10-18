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
const savePhotoformBtn = document.querySelector('#savePhoto')
const emailInput = document.querySelector('#email')

// gets a list of images from a random page with a limit of 100 items per page
const getPhoto = () => {
  const randomPage = Math.floor(Math.random() * (10) + 1)
  axios.get(`${URL}${randomPage}&limit=100`)
    .then(response => {
       getRandomPhoto(response.data)
      console.log(response.data)
    })
}
// get 1 random image from the result of getPhoto
const getRandomPhoto = (array) => {
  const randomPhoto = Math.floor(Math.random() * (array.length -1))
  const image = array[randomPhoto]
  const imageToDisplay = new Photo(image.id, image.author, image.url, image.download_url)
  displayImage(imageToDisplay)
  console.log(image)
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
}

const PhotoAttributes = (image) => {
  authorEl.innerHTML = image.author
  unsplashLinkEl.setAttribute('href',image.url)
  console.log(image.url)
}

const validateEmail = (email) => {
  if (email.match(emailRegex) && email.length > 0)  {
    console.log(email + ' valid')
  } else{
    console.log(email + ' invalid')
  }
}

// remove the last image from the dom
const removeLastPhoto = () => {
  const lastImage = document.querySelector('#loadedImg')
  imageContainer.removeChild(lastImage)
}

/*-----------------
event listeners x
-----------------*/

//load the first image on page load
document.addEventListener('DOMContentLoaded', getPhoto)


//single event listener on the document for all click events. e.target applies the event to the specified element.
document.addEventListener('click', (e) => {
  // if new image button clicked get new image and remove the old image
  if (e.target === imgEl) {
    removeLastPhoto()
    getPhoto()
  }
  // if save image button clicked remove the hidden class to show the email input
  if (e.target === savePhotoBtn) {
    savePhotoForm.classList.remove('hidden')
  }
  // if the cancel button is clicked hide the show email inpout
  if (e.target === cancelSavePhotoBtn ) {
    savePhotoForm.classList.add('hidden')
  }
  // validate email
  if (e.target === savePhotoformBtn) {
    validateEmail(emailInput.value)
  }
})

