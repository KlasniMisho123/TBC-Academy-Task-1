//   to Start
//   node task2.js

class VirtualLibrary {
  constructor() {
    this.books = [];
    this.users = [];
  }



  // ------------------ Book Methods ------------------

  addBook(book) {
    this.books.push({ ...book, available: true, borrowCount: 0 });
  }

  removeBook(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return console.log("Book not found.");
    if (!book.available) return console.log("Book is currently borrowed.");
    this.books = this.books.filter(b => b.id !== bookId);
    console.log(`Book "${book.title}" removed.`);
  }

  borrowBook(userName, bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return console.log("Book not found.");
    if (!book.available) return console.log("Book is not available.");

    let user = this.users.find(u => u.name === userName);
    if (!user) {
      user = { name: userName, borrowed: [], penaltyPoints: 0 };
      this.users.push(user);
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(borrowDate.getDate() + 14);

    user.borrowed.push({ bookId, borrowDate, dueDate });
    book.available = false;
    book.borrowCount++;
    console.log(`${userName} borrowed "${book.title}"`);
  }

  returnBook(userName, bookId) {
    const user = this.users.find(u => u.name === userName);
    const book = this.books.find(b => b.id === bookId);
    if (!user || !book) return console.log("Invalid user or book.");

    const borrowedEntry = user.borrowed.find(b => b.bookId === bookId);
    if (!borrowedEntry) return console.log("This book was not borrowed by the user.");

    const today = new Date();
    const dueDate = new Date(borrowedEntry.dueDate);

    // Remove from borrowed
    user.borrowed = user.borrowed.filter(b => b.bookId !== bookId);
    book.available = true;

    if (today > dueDate) {
      const overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      user.penaltyPoints += overdueDays;
      console.log(`Book returned late! ${overdueDays} days overdue. Penalty applied.`);
    } else {
      console.log("Thank you for returning the book on time!");
    }
  }

  // ------------------ Search & Stats ------------------

  searchBooksBy(param, value) {
    return this.books.filter(book => {
      if (param === 'rating') return book.rating >= value;
      if (param === 'year') return book.year === value || (typeof value === 'object' && value.condition === 'after' ? book.year > value.year : book.year < value.year);
      return book[param] === value;
    });
  }

  getTopRatedBooks(limit) {
    return [...this.books]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getMostPopularBooks(limit) {
    return [...this.books]
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, limit);
  }

  // ------------------ User Related ------------------

  checkOverdueUsers() {
    const today = new Date();
    const result = [];

    for (const user of this.users) {
      for (const borrowed of user.borrowed) {
        const dueDate = new Date(borrowed.dueDate);
        if (today > dueDate) {
          const overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
          result.push({ userName: user.name, bookId: borrowed.bookId, overdueDays });
        }
      }
    }
    return result;
  }

  recommendBooks(userName) {
    const user = this.users.find(u => u.name === userName);
    if (!user) return [];

    const borrowedGenres = user.borrowed
      .map(entry => this.books.find(b => b.id === entry.bookId)?.genre)
      .filter(Boolean);

    const genresSet = new Set(borrowedGenres);
    const borrowedIds = new Set(user.borrowed.map(entry => entry.bookId));

    return this.books
      .filter(book => book.available && !borrowedIds.has(book.id) && genresSet.has(book.genre))
      .sort((a, b) => b.rating - a.rating);
  }

  printUserSummary(userName) {
    const user = this.users.find(u => u.name === userName);
    if (!user) return console.log("User not found.");

    console.log(`User: ${user.name}`);
    console.log(`Penalty Points: ${user.penaltyPoints}`);
    if (user.borrowed.length === 0) {
      console.log("No borrowed books.");
      return;
    }

    for (const entry of user.borrowed) {
      const book = this.books.find(b => b.id === entry.bookId);
      const overdue = new Date() > new Date(entry.dueDate);
      console.log(`- "${book.title}" (Due: ${entry.dueDate.toDateString()}) ${overdue ? '[OVERDUE]' : ''}`);
    }
  }

  // ------------------ Initialization ------------------

  initMockData() {
    const mockBooks = [
      { id: 1, title: "JS Mastery", author: "Kyle", genre: "Tech", rating: 4.8, year: 2020 },
      { id: 2, title: "History of Europe", author: "Smith", genre: "History", rating: 4.1, year: 2008 },
      { id: 3, title: "Romance of Code", author: "Jane", genre: "Romance", rating: 4.7, year: 2019 },
      { id: 4, title: "Fantasy World", author: "Martin", genre: "Fantasy", rating: 4.9, year: 2022 },
      { id: 5, title: "Learn Fast", author: "Amy", genre: "Tech", rating: 4.2, year: 2021 },
    ];

    mockBooks.forEach(book => this.addBook(book));

    const mockUsers = [
      { name: "Alice", borrowed: [], penaltyPoints: 0 },
      { name: "Bob", borrowed: [], penaltyPoints: 0 },
    ];

    this.users.push(...mockUsers);
  }
}

// ------------------ Demo ------------------

const lib = new VirtualLibrary();
lib.initMockData();

lib.borrowBook("Alice", 1);
lib.borrowBook("Bob", 2);
lib.returnBook("Alice", 1);
lib.searchBooksBy('genre', 'Tech');
lib.getTopRatedBooks(3);
lib.getMostPopularBooks(2);
lib.printUserSummary("Alice");

console.log("Overdue Users:", lib.checkOverdueUsers());
console.log("Recommended for Bob:", lib.recommendBooks("Bob"));
