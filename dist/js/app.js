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
var savedEmails = {};
var savedImages = {};
var imageToDisplay = null;
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
var savePhotoFormBtn = document.querySelector('#savePhoto');
var emailInput = document.querySelector('#email');
var errorMessageBox = document.querySelector('#errorMessageBox');
var successMessageBox = document.querySelector('#successMessageBox'); // gets a list of images from a random page with a limit of 100 items per page

var getPhoto = function getPhoto() {
  var randomPage = Math.floor(Math.random() * 10 + 1);
  axios.get("".concat(URL).concat(randomPage, "&limit=100")).then(function (response) {
    getRandomPhoto(response.data);
  });
}; // get 1 random image from the result of getPhoto


var getRandomPhoto = function getRandomPhoto(array) {
  var randomPhoto = Math.floor(Math.random() * (array.length - 1));
  var image = array[randomPhoto];
  var imageToDisplay = new Photo(image.id, image.author, image.url, image.download_url);
  displayImage(imageToDisplay);
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
  imageToDisplay = image;
}; // get the author and the unsplash link of the current photo


var PhotoAttributes = function PhotoAttributes(image) {
  authorEl.innerHTML = image.author;
  unsplashLinkEl.setAttribute('href', image.url);
}; // check that the email input is not empty and contains a properly formatted email address


var validateEmail = function validateEmail(email) {
  if (email.match(emailRegex) && email.length > 0) {
    return email;
  } else {
    return false;
  }
}; // remove the last image from the dom and hide the show email input if shown


var removeLastPhoto = function removeLastPhoto() {
  var lastImage = document.querySelector('#loadedImg');
  imageContainer.removeChild(lastImage);
  savePhotoForm.classList.add('hidden');
};

var cleanUp = function cleanUp() {
  removeLastPhoto();
  getPhoto();
  errorMessageBox.innerHTML = '';
  errorMessageBox.classList.add('hidden');
  successMessageBox.innerHTML = "";
  successMessageBox.classList.add('hidden');
};

var saveEmail = function saveEmail(email) {
  var isNewEmail = true;
  var alreadyLinked = false;

  for (savedEmail in savedEmails) {
    if (savedEmail === email) {
      isNewEmail = false;
      break;
    }
  }

  if (isNewEmail) {
    savedEmails["".concat(email)] = [imageToDisplay];
  } else {
    for (var i = 0; i < savedEmails["".concat(email)].length; i++) {
      if (savedEmails["".concat(email)][i].id === imageToDisplay.id) {
        alreadyLinked = true;
        console.log('image already linked');
        break;
      }
    }

    if (!alreadyLinked) {
      savedEmails["".concat(email)].push(imageToDisplay);
    }
  }
};

var listEmails = function listEmails() {
  var emails = [];

  for (var email in savedEmails) {
    emails.push(email);
  }

  return emails;
};
/*----------------
event listeners x
-----------------*/
// load the first image on page load


document.addEventListener('DOMContentLoaded', getPhoto); // single event listener on the document for all click events. e.target applies the event to the specified element.

document.addEventListener('click', function (e) {
  // if new image button clicked get new image and remove the old image
  if (e.target === imgEl) {
    cleanUp();
  } // if save image button clicked remove the hidden class to show the email input


  if (e.target === savePhotoBtn) {
    savePhotoForm.classList.remove('hidden');
  } // if the cancel button is clicked hide the show email input


  if (e.target === cancelSavePhotoBtn) {
    savePhotoForm.classList.add('hidden');
    errorMessageBox.innerHTML = '';
    errorMessageBox.classList.add('hidden');
  }

  if (e.target === savePhotoFormBtn) {
    var isValidEmail = validateEmail(emailInput.value);

    if (!isValidEmail) {
      errorMessageBox.innerHTML = 'Please enter a valid Email';
      errorMessageBox.classList.remove('hidden');
      console.log('not valid email');
    } else {
      successMessageBox.innerHTML = 'Photo Saved!';
      successMessageBox.classList.remove('hidden');
      setTimeout(function () {
        saveEmail(emailInput.value);
        cleanUp();
      }, 2000);
    }
  }
});