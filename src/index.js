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

// Функция поиска последней страницы по данному запросу.

const findLastPage = (value) => Math.ceil(value.totalHits / myApiService.per_page);

// Функция - обработчик события нажатия на кнопку поиска. 
function onSubmit(event) {

  // Отменяем действие по умолчанию и сбрасываем галерею с кнопкой загрузки.
  event.preventDefault();
  refs.gallery.innerHTML = '';
  refs.loadBtn.classList.add('is-hidden');


  // Проверяем значеник в поле поиска с параменту поиска в API сервисе.Выполняем блок кода, если значение в поле поиска новое.
  if (myApiService.query !== event.currentTarget.elements.searchQuery.value) {
    myApiService.query = event.currentTarget.elements.searchQuery.value;
    myApiService.page = 1;
    validationOfOutcomingResult(myApiService, true, true);
    myApiService.page += 1;
  }
  // Если значение не новое, проверяем не превышает ли значение текущей станицы значение последней страницы по данному запросу
  else {
    if (myApiService.page >= myApiService.lastPage) {
      myApiService.page = myApiService.lastPage;
      validationOfOutcomingResult(myApiService)
      endOfGalleryNotification();
      return
    }
    else {
      console.log('myApiService.lastPage before:>> ', myApiService.lastPage);
      validationOfOutcomingResult(myApiService);
      myApiService.page += 1;
       console.log('myApiService.lastPage after ', myApiService.lastPage);
    }       
  }
}

// Функция - обработчик кнопки подгрузки изображений.
async function onLoadMore() {
  refs.formEl.reset();

  try {
    const fetchingRequest = await myApiService.fetchData();
    renderImages(fetchingRequest.hits);
    myApiService.page === myApiService.lastPage && endOfGalleryNotification();
    myApiService.page += 1;
  } catch (error) {
    Notify.failure(error.name);
  } 
}


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

// Функция отрисовки изображений в галерее. Принимает массив объектов изображений. Результат - разметка галереи.
function renderImages(arrayOfImagesData) {
    const markup = arrayOfImagesData.map(image => renderCardTpl({image})).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}


/**
 * 
 * Функция вызывающая рендер в зависимости от параметров поиска. Если 
 * передан воторой параметр, то выведем необходимое уведомление, в зависимости от запроса.
 * Если передан третий параментр, , то зададим последнюю страцицу в параметр API объекта.
 * @param {Promise} data 
 * @param {Boolean} notify 
 * @param {Boolean} setLastPage 
 * @returns {void}
 */

async function validationOfOutcomingResult(data, notify, setLastPage) {
  try {
    const fetchingRequest = await data.fetchData();      
    renderImages(fetchingRequest.hits);
    fetchingRequest.totalHits > data.per_page && refs.loadBtn.classList.remove('is-hidden');

    notify && notificationByFetchedResults(fetchingRequest.totalHits);
    setLastPage && (myApiService.lastPage = findLastPage(fetchingRequest));
  } catch (error) {
    Notify.failure(error.name);
  }
}

// Функция уведомления о последней странице по данному запросу. Скрывает кнопку подгрузки изображений.
function endOfGalleryNotification() {
  const message = "You have reached the end of search results"
  refs.loadBtn.classList.add('is-hidden');
  Notify.info(message, { timeout: 4000, clickToClose: true, position: 'center-bottom' });
  myApiService.page = 1;
  return
}

