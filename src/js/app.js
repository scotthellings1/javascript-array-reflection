

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
  img.classList = 'rounded-xl shadow-lg w-full h-auto'
}

const PhotoAttributes = (image) => {
  authorEl.innerHTML = image.author
  unsplashLinkEl.setAttribute('href',image.url)
  console.log(image.url)
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

// add event listener to the get new image button and remove last image and get a new image
imgEl.addEventListener('click', ()=> {
  removeLastPhoto()
  getPhoto()
})