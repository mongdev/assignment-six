const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

const getImages = async (query) => {
  toggleSpinner();
  const url = `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    showImages(data.hits);
  } catch (error) {
    console.log("sorry! i failed to fetch");
  }
};

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2 imagesDiv";
    div.innerHTML = `
    <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
    <a><i class="far fa-user"></i> ${image.user}</a>
    <a><i class="far fa-thumbs-up"></i> ${image.likes}</a>
    <a><i class="far fa-heart"></i> ${image.favorites}</a>
    <a><i class="far fa-comment"></i> ${image.comments}</a>
    `;
    gallery.appendChild(div);
  });
  toggleSpinner();
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add("added");

  let item = sliders.indexOf(img);

  if (item === -1) {
    sliders.push(img);
  } else {
    element.classList.remove("added");
    sliders.splice(item, 1);
  }
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item

var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  const duration = document.getElementById("duration").value || 1000;
  if (duration <= 0) {
    alert("Duration, Cant be negative !");
    return;
  } else {
    // crate slider previous next area
    sliderContainer.innerHTML = "";
    const prevNext = document.createElement("div");
    prevNext.className =
      "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext);
    document.querySelector(".main").style.display = "block";
    // hide image aria
    imagesArea.style.display = "none";

    sliders.forEach((slide) => {
      let item = document.createElement("div");
      item.className = "slider-item";
      item.innerHTML = `
      <img class="w-100"
    src="${slide}"
    alt="">
    `;
      sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
};

const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
});

sliderBtn.addEventListener("click", function () {
  createSlider();
});

//search-enter-button-keypress
document
  .getElementById("search")
  .addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      event.preventDefault();
      document.getElementById("search-btn").click();
    }
  });

//slide-enter-button-keypress
document
  .getElementById("duration")
  .addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      event.preventDefault();
      document.getElementById("create-slider").click();
    }
  });
// toggle-spinner-script
const toggleSpinner = () => {
  const spinner = document.getElementById("loading-spinner");
  const imagesArea = document.querySelector(".images");
  spinner.classList.toggle("d-none");
  imagesArea.classList.toggle("d-none");
};
