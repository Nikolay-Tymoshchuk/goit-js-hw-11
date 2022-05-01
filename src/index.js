import renderCardTpl from './templates/render-card.hbs';
import { Notify } from 'notiflix';
import NewsApiService from './js/api-service';
const refs = {
    searchField: document.body.querySelector('.search-form__input'),
    formEl: document.body.querySelector('.search-form'),
    gallery: document.body.querySelector('.gallery'),
    loadBtn: document.body.querySelector('.load-more'),
}

const myApiService = new NewsApiService();


// При нажатии на кнопку поиска вызывается функция onSubmit.
refs.formEl.addEventListener('submit', onSubmit);
refs.loadBtn.addEventListener('click', onLoadMore);



// Функция уведомлений, в зависимости от количества найденных изображений. 
function notificationByFetchedResults(lengthOfResultedArray) {
  const messageIfNotFounded = "Sorry, there are no images matching your search query. Please try again.";
  const messageIfFoundOne = `You are lucky! We found 1 image.`;
  const messaheIfFoundedMany = `We found ${lengthOfResultedArray} images.`;

  if (lengthOfResultedArray === 0) {
    Notify.failure(messageIfNotFounded);
  } else if (lengthOfResultedArray === 1) {
    Notify.success(messageIfFoundOne);
  } else {
    Notify.success(messaheIfFoundedMany);
  } 
}


// Инициализация функции сабмита поиска


// Функция отрисовки изображений в галерее. Принимает массив объектов изображений. Результат - разметка галереи.
function renderImages(arrayOfImagesData) {
    const markup = arrayOfImagesData.map(image => renderCardTpl({image})).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}


async function onSubmit(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  refs.loadBtn.classList.add('is-hidden');

  try {
    if (myApiService.query !== event.currentTarget.elements.searchQuery.value) {
      myApiService.query = event.currentTarget.elements.searchQuery.value;
      myApiService.page = 1;
      await validationOfOucomingResult(myApiService, true);
    } else { 
      myApiService.page += 1;
      await validationOfOucomingResult(myApiService);
    }
    
  }
  catch (error) {
    Notify.failure(error.name);
  }
}

async function onLoadMore() {
  try {
    myApiService.page += 1;
    const fetchingRequest = await myApiService.fetchData();
    renderImages(fetchingRequest.hits);
  } catch (error) {
    Notify.failure(error.name);
  } 
}

async function validationOfOucomingResult(data, notify) {
  const fetchingRequest = await data.fetchData();      
  renderImages(fetchingRequest.hits);
  fetchingRequest.totalHits > data.per_page && refs.loadBtn.classList.remove('is-hidden');
  notify && notificationByFetchedResults(fetchingRequest.totalHits);
}

