function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Photo = function Photo(id, author, url, download_url) {
  _classCallCheck(this, Photo);

  this.id = id;
  this.author = author;
  this.url = url;
  this.download_url = download_url;
}; // base url for lorem picsum


var URL = 'https://picsum.photos/v2/list?page='; // Regex for checking a valid email

var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
/*-----------------
HTML Selectors
-----------------*/

var imgEl = document.querySelector('#newImage'); // new image button

var imageContainer = document.querySelector('#imageContainer'); // div that should hold the image.

var authorEl = document.querySelector('#author');
var unsplashLinkEl = document.querySelector('#unsplashLink');
var savePhotoBtn = document.querySelector('#saveImage');
var cancelSavePhotoBtn = document.querySelector('#cancelSavePhoto');
var savePhotoForm = document.querySelector('#savePhotoForm');
var savePhotoformBtn = document.querySelector('#savePhoto');
var emailInput = document.querySelector('#email'); // gets a list of images from a random page with a limit of 100 items per page

var getPhoto = function getPhoto() {
  var randomPage = Math.floor(Math.random() * 10 + 1);
  axios.get("".concat(URL).concat(randomPage, "&limit=100")).then(function (response) {
    getRandomPhoto(response.data);
    console.log(response.data);
  });
}; // get 1 random image from the result of getPhoto


var getRandomPhoto = function getRandomPhoto(array) {
  var randomPhoto = Math.floor(Math.random() * (array.length - 1));
  var image = array[randomPhoto];
  var imageToDisplay = new Photo(image.id, image.author, image.url, image.download_url);
  displayImage(imageToDisplay);
  console.log(image);
  PhotoAttributes(imageToDisplay);
}; // create an img element and append it to the DOM


var displayImage = function displayImage(image) {
  var img = new Image();

  img.onload = function () {
    imageContainer.appendChild(img);
  };

  img.id = 'loadedImg';
  img.src = image.download_url;
  img.classList = 'h-128 rounded-xl shadow-lg m-auto';
};

var PhotoAttributes = function PhotoAttributes(image) {
  authorEl.innerHTML = image.author;
  unsplashLinkEl.setAttribute('href', image.url);
  console.log(image.url);
};

var validateEmail = function validateEmail(email) {
  if (email.match(emailRegex) && email.length > 0) {
    console.log(email + ' valid');
  } else {
    console.log(email + ' invalid');
  }
}; // remove the last image from the dom


var removeLastPhoto = function removeLastPhoto() {
  var lastImage = document.querySelector('#loadedImg');
  imageContainer.removeChild(lastImage);
};
/*-----------------
event listeners x
-----------------*/
//load the first image on page load


document.addEventListener('DOMContentLoaded', getPhoto); //single event listener on the document for all click events. e.target applies the event to the specified element.

document.addEventListener('click', function (e) {
  // if new image button clicked get new image and remove the old image
  if (e.target === imgEl) {
    removeLastPhoto();
    getPhoto();
  } // if save image button clicked remove the hidden class to show the email input


  if (e.target === savePhotoBtn) {
    savePhotoForm.classList.remove('hidden');
  } // if the cancel button is clicked hide the show email inpout


  if (e.target === cancelSavePhotoBtn) {
    savePhotoForm.classList.add('hidden');
  } // validate email


  if (e.target === savePhotoformBtn) {
    validateEmail(emailInput.value);
  }
});