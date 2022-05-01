import MyError from './myError';

export default class NewsApiService {
  constructor() {
        this.searchQuery = '';
        this.KEY = '27097192-0671b14f562b4984cf83e0bbe';
        this.IMAGE_TYPE = 'photo';
        this.ORIENTATION = 'horizontal';
        this.SAFESEARCH = 'true';
        this.BASE_URL = 'https://pixabay.com/api/';
        this.page = 1;
      this.per_page = 20;
      this.lastPage = 1;
    }
    
    getOptions() {
        const searchParams = new URLSearchParams({
            key: this.KEY,
            q: this.searchQuery,
            image_type: this.IMAGE_TYPE,
            orientation: this.ORIENTATION,
            safesearch: this.SAFESEARCH,
            page: this.page,
            per_page: this.per_page
        });

        return searchParams;
    }     

    fetchData() {
        return fetch(`${this.BASE_URL}?${this.getOptions()}`).then(res => {

            if (res.status === 400) {
                throw new MyError("Sorry, there are no images matching your search query. Please try again.");
            }

            let type = res.headers.get('Content-Type');
            if (type !== 'application/json') {
                throw new TypeError();
            }
        return res.json();
        });
    }
    
    get query() {
        return this.searchQuery;
    }

    set query(value) {
        this.searchQuery = value;
    }

}