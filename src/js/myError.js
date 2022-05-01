
export default class MyError extends Error {
    constructor(value, ...params) {
        super(params);
        this.name = 'MyError';
        this.message = value;
    }
}