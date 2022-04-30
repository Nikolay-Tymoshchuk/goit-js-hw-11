import renderCardTpl from './templates/render-card.hbs';
import { Notify } from 'notiflix';
const refs = {
    searchField: document.body.querySelector('.search-form__input'),
    formEl: document.body.querySelector('.search-form'),
    gallery: document.body.querySelector('.gallery'),
    loadBtn: document.body.querySelector('.load-more'),
}

let searchFieldValue = null; 

const KEY = '27097192-0671b14f562b4984cf83e0bbe';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';
const BASE_URL = 'https://pixabay.com/api/';

const searchParams = new URLSearchParams({
  key: KEY,
  q: searchFieldValue,
  image_type: IMAGE_TYPE,
  orientation: ORIENTATION,
  safesearch: SAFESEARCH,
  page: 1,
  per_page: 20, 
})

// При нажатии на кнопку поиска вызывается функция onSubmit.
refs.formEl.addEventListener('submit', onSubmit);

// Функция изменения значения поля поиска в параметрах запроса. Возвращает объект параметров в виде JSON-строки.
function requestGeneration() {
  const searchFieldValue = refs.searchField.value;
  let count = Number(searchParams.get('page'));

  if (searchParams.get('q') === searchFieldValue) {
    count += 1;

    searchParams.set('page', count);
    return searchParams.toString();
  }
  searchParams.set('q', searchFieldValue);
  searchParams.set('page', 1);
  return searchParams.toString();
}

// Функция запроса в базу данных. Возвращает промис с данными(найденные объекты) в JSON-формате 
async function getData() {
    const message = "Sorry, there are no images matching your search query. Please try again.";
    const response = await fetch(`${BASE_URL}?${searchParams}`);;
    const data = await response.json();
    const numbersOfImages = data.totalHits;
    numbersOfImages === 0 
    ? Notify.failure(message) : numbersOfImages === 1 ? Notify.success(`You are lucky! We found 1 image.`) : Notify.success(`We found ${numbersOfImages} images.`);
    const images = await data.hits;
    return images;
}

// Инициализация функции сабмита поиска
async function onSubmit(event) {
    event.preventDefault();
  requestGeneration();
  
    try {
      const images = await getData();
      renderImages(images);
      refs.loadBtn.classList.remove('is-hidden');
    } catch (error) {
        Notify.failure(error.name);
    }
}

// Функция отрисовки изображений в галерее. Принимает массив объектов изображений. Результат - разметка галереи.
function renderImages(arrayOfImagesData) {
  refs.gallery.innerHTML = '';
    const markup = arrayOfImagesData.map(image => renderCardTpl({image})).join('');
    refs.gallery.insertAdjacentHTML('afterbegin', markup);
}
