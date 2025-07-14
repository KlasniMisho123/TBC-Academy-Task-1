//   to Start
//   node index.js

class VirtualLibrary {
    constructor() {
        this.books = []
        this.users = []
    }

    addBook(book) {
        this.books.push({ ...book, available: true, borrowCount: 0});
    }

    removeBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) {
            return console.log("Book doesn't Exists")
        } else if (!book.available) {
            return console.log("Can't remove currently borrowed book")
        } else {
            this.books = this.books.filter(b => b.id !== bookId);
            console.log(`Book named ${book.title} was removed`)
        }
    }

}

const db = new VirtualLibrary

dummyBookData = [
    { id: 1, title: "JS Mastery", author: "Kyle", genre: "Tech", rating: 4.8, year: 2020 },
    { id: 2, title: "History of Europe", author: "Smith", genre: "History", rating: 4.1, year: 2008 },
    { id: 3, title: "Romance of Code", author: "Jane", genre: "Romance", rating: 4.7, year: 2019 },
    { id: 4, title: "Fantasy World", author: "Martin", genre: "Fantasy", rating: 4.9, year: 2022 },
    { id: 5, title: "Learn Fast", author: "Amy", genre: "Tech", rating: 4.2, year: 2021 },
]

dummyBookData.forEach(book => {
    db.addBook(book)
});

db.removeBook(2);

console.log(db.books)