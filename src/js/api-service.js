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

    async fetchData() {
        const response = await fetch(`${this.BASE_URL}?${this.getOptions()}`);
        const data = await response.json();
        return data;
    }
    
    get query() {
        return this.searchQuery;
    }

    set query(value) {
        this.searchQuery = value;
    }

}