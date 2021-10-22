function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Photo = function Photo(id, author, url, download_url) {
  _classCallCheck(this, Photo);

  this.id = id;
  this.author = author;
  this.url = url;
  this.download_url = download_url;
}; // base url for lorem picsum


var picsumURL = 'https://picsum.photos/v2/list?page='; // Regex for checking a valid email

var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
var savedEmails = {};
var imageToDisplay = null;
/*-----------------
HTML Selectors
-----------------*/

var imgEl = document.querySelector('#newImage'),
    // new image button
imageContainer = document.querySelector('#imageContainer'),
    // div that should hold the image.
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
    gallery = document.querySelector('#gallery'); // gets a list of images from a random page with a limit of 100 items per page

var getPhoto = function getPhoto() {
  var randomPage = Math.floor(Math.random() * 10 + 1);
  axios.get("".concat(picsumURL).concat(randomPage, "&limit=100")).then(function (response) {
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
  img.classList.add('lg:h-128', 'rounded-xl', 'shadow-lg', 'm-auto');
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
  var elements = [errorMessageBox, successMessageBox];
  elements.forEach(function (element) {
    element.innerHTML = '';
    element.classList.add('hidden');
  });
}; // get a list of the currently saved email addresses and save as an array


var listEmails = function listEmails() {
  var emails = [];

  for (var email in savedEmails) {
    emails.push(email);
  }

  return emails;
}; // remove the old list and update with the current list of saved emails and append each one as a li to the ul in the
// sidebar


var updateEmailList = function updateEmailList() {
  var newList = listEmails();
  linkedEmailList.innerHTML = '';

  for (var i = 0; i < newList.length; i++) {
    var li = document.createElement('li');
    li.classList.add('cursor-pointer', 'py-2', 'linked-email');
    li.innerHTML = "".concat(newList[i], "<span class=\"pr-2 text-center ml-2 bg-blue-400 rounded-full pushy-link\"> ").concat(savedEmails[newList[i]].length, "</span>");
    linkedEmailList.appendChild(li);
  }
}; // save the current photo and associate it with an email address


var saveEmail = function saveEmail(email) {
  var isNewEmail = true;
  var alreadyLinked = false;

  for (var savedEmail in savedEmails) {
    if (savedEmail === email) {
      isNewEmail = false;
      break;
    }
  }

  if (isNewEmail) {
    savedEmails["".concat(email)] = [imageToDisplay];
    updateEmailList();
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
      updateEmailList();
    }
  }
}; // show the gallery container and buttons


var createGallery = function createGallery() {
  buttonsContainer.classList.add('hidden');
  gallery.classList.remove('hidden');
  galleryButtonsContainer.classList.remove('hidden');
}; // remove all the images in the current gallery and hide the gallery buttons


var destroyGallery = function destroyGallery() {
  buttonsContainer.classList.remove('hidden');
  galleryButtonsContainer.classList.add('hidden');
  gallery.classList.add('hidden');
  gallery.innerHTML = '';
}; // get and display the images for a linked email address


var getLinkedPhotos = function getLinkedPhotos(linkedEmail) {
  var emailstr = linkedEmail.innerText;
  var email = emailstr.split(" ")[0];
  var photos = savedEmails[email];
  destroyGallery();
  createGallery(); // set image width to full width if only 1 image

  if (photos.length === 1) {
    img = new Image();
    img.src = photos[0].download_url;
    img.classList.add('w-full', 'flex-shrink', 'p-2', 'rounded-xl');
    gallery.appendChild(img);
  } // set image width to 50% if there are 2 images


  if (photos.length === 2) {
    for (var i = 0; i < photos.length; i++) {
      img = new Image();
      img.src = photos[i].download_url;
      img.classList.add('w-full', 'md:w-1/2', 'flex-shrink', 'p-2', 'rounded-xl');
      gallery.appendChild(img);
    }
  } // if there are more than 2 images set the width of the images to 33%


  if (photos.length > 2) {
    for (var _i = 0; _i < photos.length; _i++) {
      img = new Image();
      img.src = photos[_i].download_url;
      img.classList.add('w-full', 'md:w-1/3', 'flex-shrink', 'p-2', 'rounded-xl');
      gallery.appendChild(img);
    }
  }
};
/*----------------
event listeners x
-----------------*/
// prevent the default form submission when pressing the enter key in the email field


photoForm.addEventListener('submit', function (e) {
  e.preventDefault();
}); // add listener to enter key to submit and save the photo

photoForm.addEventListener("keyup", function (e) {
  e.preventDefault();

  if (e.keyCode === 13) {
    savePhotoFormBtn.click();
  }
}); // add event listener to each li in the side menu to link to the gallery for a linked email

linkedEmailList.addEventListener('click', function (e) {
  // if the are no linked emails do not load the gallery, else call the getLinkedPhotos function which loads the gallery
  if (e.target.innerHTML !== 'No Emails Saved yet!') {
    // if there is a loaded image remove it from the DOM
    if (document.querySelector('#loadedImg')) {
      removeLastPhoto();
    }

    getLinkedPhotos(e.target);
  }
}); // load the first image on page load

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
  } // close the gallery and get a new photo to link to an email


  if (e.target === GalleryNewImage) {
    destroyGallery();
    getPhoto();
  }

  if (e.target === savePhotoFormBtn) {
    var isValidEmail = validateEmail(emailInput.value);

    if (!isValidEmail) {
      errorMessageBox.innerHTML = 'Please enter a valid Email';
      errorMessageBox.classList.remove('hidden');
    } else {
      errorMessageBox.classList.add('hidden');
      successMessageBox.innerHTML = 'Photo Saved!';
      successMessageBox.classList.remove('hidden');
      setTimeout(function () {
        saveEmail(emailInput.value);
        cleanUp();
      }, 2000);
    }
  }
});