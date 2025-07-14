//   to Start
//   node index.js

class VirtualLibrary {
    constructor() {
        this.books = []
        this.users = []
    }

    addBook(book) {
        this.books.push({...this.books, available: true, borrowCount: 0})
    }
}

const db = new VirtualLibrary

console.log(db)