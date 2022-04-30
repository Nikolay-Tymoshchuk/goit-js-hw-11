// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
//     safesearch - фильтр по возрасту.Задай значение true
const refs = {
    searchField: document.body.querySelector('.search-form__input'),
    formEl: document.body.querySelector('.search-form'),
    gallery: document.body.querySelector('.gallery'),

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
})

// При нажатии на кнопку поиска вызывается функция onSubmit.
refs.formEl.addEventListener('submit', onSubmit);

// Функция изменения значения поля поиска в параметрах запроса. Возвращает обновленные параметры в виде JSON-строки.
function requestGeneration() {;
    const searchFieldValue = refs.searchField.value;
    searchParams.set('q', searchFieldValue);
    return searchParams.toString();
}
// Функция запроса в базу данных. Возвращает промис с данными в JSON-формате 
async function getData() {
    const response = await fetch(`${BASE_URL}?${searchParams}`);
    const data = await response.json();
    const images = data.hits;
    return images;
}

async function onSubmit(event) {
    event.preventDefault();
    requestGeneration();

    try {
        const images = await getData();
        renderImages(images);
    } catch (error) {
        console.log('error :>> ', error);
    }
    // renderImages(arrayOfImagesData);
}

function renderImages(arrayOfImagesData) {
    const markup = arrayOfImagesData.map(image => {
        return `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${image.downloads}</b>
    </p>
  </div>
</div>`;
    }).join('');
    refs.gallery.insertAdjacentHTML('afterbegin', markup);
}



// const images = data.hits;
//     const imagesContainer = document.body.querySelector('.images-container');
//     imagesContainer.innerHTML = '';
//     images.forEach(image => {
//         const imageElement = document.createElement('img');
//         imageElement.src = image.previewURL;
//         imageElement.alt = image.tags;
//         imagesContainer.append(imageElement);
//     });

// final result