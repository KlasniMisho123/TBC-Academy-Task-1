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
            console.log(`Book returned late! ${overdueDays} days overdue. Penalty points (${user.penaltyPoints}) applied.`);
        } else {
            console.log("Thank you for returning book on time! ")
        }
    }

    searchBooksBy(param, value) {
        return this.books.filter(book => {
            if (param === 'rating') return book.rating >= value;
            if (param === 'year') return book.year === value || (typeof value === 'object' && value.condition === 'after' ? book.year > value.year : book.year < value.year);
            return book[param] === value;
        });
    }

    getTopRatedBooks(limit) {
         if(limit > this.books.length) console.log(`Only ${this.books.length} Book is in Library, Top ${this.books.length} Rated Books in our Library: `)
            else {
                console.log(`Top ${limit} Rated Book In our Library: `)
            }

        const result = [...this.books].sort((a, b) => b.rating - a.rating).slice(0, limit);
        return(result);
    }

    getMostPopularBooks(limit) {
        if(limit > this.books.length) console.log(`Only ${this.books.length} Book is in Library, ${this.books.length} Most Popular Book in our Library: `)
            else {
                console.log(` ${limit} Most Popular Book In our Library:  `)
            }
        const result = [...this.books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, limit);
        return(result);
    }

    checkOverdueUsers() {
        const currentDate = new Date();
        const result = [];

        this.users.forEach(user => {
            user.borrowed.forEach(borrowed => {
            if (currentDate > borrowed.dueDate) {
                const overdueDays = Math.ceil(
                (currentDate - borrowed.dueDate) / (1000 * 60 * 60 * 24)
                );
                user.penaltyPoints += overdueDays
                result.push({
                userName: user.name,
                bookId: borrowed.bookId,
                overdueDays: overdueDays
                });
            }
            });
        });

        console.log(result);
        return result;
    }

    recommendBooks(userName) {
        const user = this.users.find(u => u.name === userName)
        if(!user) return []
        
        const borrowedGenres = user.borrowed
            .map(entry => this.books.find(b => b.id === entry.bookId)?.genre)
            .filter(Boolean)

        const genresSet = new Set(borrowedGenres)
        const borrowedIds = new Set(user.borrowed.map(entry => entry.bookId))

        return this.books
            .filter(book => book.available && !borrowedIds.has(book.id) && genresSet.has(book.genre))
            .sort((a,b) => b.rating - a.rating)
    }

    printUserSummary(userName){
        const user = this.users.find(u => u.name === userName);
        if(!user) return(console.log("User Not Found. "))

        console.log(`User: ${user.name}`);
        console.log(`Penalty Points: ${user.penaltyPoints}`);
        if(user.borrowed.length === 0) {
            console.log("User have no borrowed books.")
            return
        }

        user.borrowed.forEach((borrowed) => {
            const book = this.books.find(b => b.id === borrowed.bookId)
            const overdue = new Date() > new Date(borrowed.dueDate)
            console.log(`Title: ${book.title} `)
            console.log(`Due To: ${borrowed.dueDate.toDateString()}. ${overdue ? "[OVERDUE]" : ""}`)
        })
    }

    initMockData() {
      const dummyBookData = [
            { id: 1, title: "JS Mastery", author: "Kyle", genre: "Tech", rating: 4.8, year: 2020 },
            { id: 2, title: "History of Europe", author: "Smith", genre: "History", rating: 4.1, year: 2008 },
            { id: 3, title: "Romance of Code", author: "Jane", genre: "Romance", rating: 4.7, year: 2019 },
            { id: 4, title: "Fantasy World", author: "Martin", genre: "Fantasy", rating: 4.9, year: 2022 },
            { id: 5, title: "Learn Fast", author: "Amy", genre: "Tech", rating: 4.2, year: 2021 },
            { id: 6, title: "JS Mastery2", author: "Kyle2", genre: "Tech", rating: 4.9, year: 2022 },
            { id: 7, title: "Fantasy World2", author: "Martin", genre: "Fantasy", rating: 5.0, year: 2023 },
            { id: 8, title: "Ancient Empires", author: "Clara", genre: "History", rating: 3.9, year: 2005 },
            { id: 9, title: "The JavaScript Path", author: "Tina", genre: "Tech", rating: 4.5, year: 2024 },
            { id: 10, title: "Love in the Console", author: "Jane", genre: "Romance", rating: 4.3, year: 2020 },
        ];


       dummyBookData.forEach(book => { this.addBook(book)});
            const dummyUsersData = [
                {
                    name: 'Misho',
                    borrowed: [{
                        bookId: 1,
                        borrowDate: new Date('2025-07-01T10:00:00Z'),
                        dueDate: new Date('2025-07-15T10:00:00Z')
                    },{
                        bookId: 4,
                        borrowDate: new Date('2025-07-01T10:00:00Z'),
                        dueDate: new Date('2025-07-15T10:00:00Z')
                    }],
                    penaltyPoints: 0
                },
                {
                    name: 'Zoe',
                    borrowed: [
                    {
                        bookId: 2,
                        borrowDate: new Date('2025-07-10T12:00:00Z'),
                        dueDate: new Date('2025-07-24T12:00:00Z')
                    }
                    ],
                    penaltyPoints: 1
                },
                {
                    name: 'Nino',
                    borrowed: [
                        {
                            bookId: 5,
                            borrowDate: new Date('2025-06-30T10:00:00Z'),
                            dueDate: new Date('2025-07-13T10:00:00Z')
                        }],
                    penaltyPoints: 0
                },
                {
                    name: 'Ame',
                    borrowed: [
                    {
                        bookId: 4,
                        borrowDate: new Date('2025-06-25T08:00:00Z'),
                        dueDate: new Date('2025-07-09T08:00:00Z')
                    }
                    ],
                    penaltyPoints: 3
                },
                {
                    name: 'Ana',
                    borrowed: [
                        {
                            bookId: 3,
                            borrowDate: new Date('2025-06-20T10:00:00Z'),
                            dueDate: new Date('2025-07-04T10:00:00Z')
                        }
                    ],
                    penaltyPoints: 0
                }
        ];

        dummyUsersData.forEach(user => {
            this.users.push(user)
        });


        this.users.forEach(user => {
            user.borrowed.forEach(borrowedEntry => {
            const book = this.books.find(book => book.id === borrowedEntry.bookId);
            if (book) {
                book.available = false;
                book.borrowCount++;
            }
            });
        });
    }
    
}

const db = new VirtualLibrary

db.initMockData();

// db.checkOverdueUsers();

// console.log(db.getMostPopularBooks(10));

// db.returnBook("Misho", 1)

// db.printUserSummary("Misho");