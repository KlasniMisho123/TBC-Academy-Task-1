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

    borrowBook(userName, bookId) {
        const book = this.books.find(b => b.id === bookId);
        if(!book) {
            return console.log("We dont have that book")
        } 
        if (!book.available) {
            return console.log("Book is not available")
        } 

        let user = this.users.find(u => u.name === userName)
        if (!user) {
            user = { name: userName, borrowed: [], penaltyPoints: 0};
            this.users.push(user)
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + 14);

        user.borrowed.push({ bookId, borrowDate, dueDate });
        book.available = false;
        book.borrowCount++;
        console.log(`User: ${userName} borrowed book:${book.title}`)
    }

    returnBook(userName, bookId) {
        const book = this.books.find(b => b.id === bookId)
        const user = this.users.find(u => u.name === userName)
        if(!book || !user) {
            return console.log("Invalid book or user.")
        }

        const borrowedEntry = user.borrowed.find(b => b.bookId === bookId)
        if(!borrowedEntry) {
            return console.log(`This book wasn't borrowed by user: ${user.name}`)
        }

        const today = new Date()
        const dueDate = new Date(borrowedEntry.dueDate)

        user.borrowed = user.borrowed.filter(b => b.bookId !== bookId);
        book.available = true;

        if(today > dueDate) {
            const overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
            user.penaltyPoints += overdueDays;
            console.log(`Book returned late! ${overdueDays} days overdue. Penalty points(${penaltyPoints} applied. )`)
        } else {
            console.log("Thank you for returning book on time! ")
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

db.borrowBook("misho", 1)

// db.removeBook(2);

//  - check borrowed books from user-1
// console.log("borrowed book: ",db.users[0].borrowed)
db.returnBook("misho", 1)
// console.log(db.books)