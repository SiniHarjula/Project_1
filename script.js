// Selecting elements and initializing variables
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const popupWindow = document.getElementById('book-popup');
const closePopup = document.querySelector('.close-popup');
const saveChangesButton = document.getElementById('save-changes');
const deleteBookButton = document.getElementById('delete-book');
const bookCounter = document.getElementById('book-counter');

let currentBookElement = null;
let currentBookTitle = "";

// Function for adding books to the list
function addBook(event) {
  event.preventDefault(); // Preventing page reload

  // Getting information from the form
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;
  const genre = document.getElementById('genre').value;
  const pages = document.getElementById('pages').value;
  const readingdate = document.getElementById('readingdate').value;
  const review = document.getElementById('review').value;
  const coverInput = document.getElementById('cover');
  const coverFile = coverInput.files[0];

  // Checking if all required fields are filled
  if (!title || !author || !year || !genre || !pages || !readingdate) {
    alert("Please fill in all required fields!");
    return;
  }

  const bookId = Date.now().toString(); // Unique ID for the book

  const reader = new FileReader();
  reader.onload = function (e) {
    const book = {
      id: bookId,
      title,
      author,
      year,
      genre,
      pages,
      readingdate,
      review,
      cover: e.target.result
    };
    saveBookToLocalStorage(book);
    displayBooks();
    bookForm.reset();
    updateBookCounter();
  };

  if (coverFile) {
    reader.readAsDataURL(coverFile);
  } else {
    const book = {
      id: bookId,
      title,
      author,
      year,
      genre,
      pages,
      readingdate,
      review,
      cover: null
    };
    saveBookToLocalStorage(book);
    displayBooks();
    bookForm.reset();
    updateBookCounter();
  }
}

// Function for displaying books in the list
function displayBook(book) {
  const bookItem = document.createElement('div');
  bookItem.classList.add('book-item');
  bookItem.dataset.id = book.id;
  bookItem.innerHTML = `
    <img src="${book.cover ? book.cover : 'placeholder.jpg'}" alt="${book.title} cover" class="book-cover">
  `;
  bookItem.addEventListener('click', () => openBookPopup(book, bookItem));
  bookList.appendChild(bookItem);
}

// Function for opening pop-up window with book details
function openBookPopup(book, bookElement) {
  popupWindow.style.display = "flex";
  document.getElementById('edit-title').value = book.title;
  document.getElementById('edit-author').value = book.author;
  document.getElementById('edit-year').value = book.year;
  document.getElementById('edit-genre').value = book.genre;
  document.getElementById('edit-pages').value = book.pages;
  document.getElementById('edit-readingdate').value = book.readingdate;
  document.getElementById('edit-review').value = book.review;
  currentBookElement = bookElement;
  currentBookTitle = book.title;
}

// Closing the pop-up window
closePopup.addEventListener('click', () => {
  popupWindow.style.display = "none";
});

// Event listener for save changes button
saveChangesButton.addEventListener('click', () => {
  if (!currentBookElement || !currentBookTitle) return;

  const updatedBook = {
    id: currentBookElement.dataset.id,
    title: document.getElementById('edit-title').value,
    author: document.getElementById('edit-author').value,
    year: document.getElementById('edit-year').value,
    genre: document.getElementById('edit-genre').value,
    pages: document.getElementById('edit-pages').value,
    readingdate: document.getElementById('edit-readingdate').value,
    review: document.getElementById('edit-review').value,
    cover: currentBookElement.querySelector('img').src
  };

  let books = getBooksFromLocalStorage();
  books = books.map(book => book.id === updatedBook.id ? updatedBook : book);
  localStorage.setItem('books', JSON.stringify(books));

  displayBooks();
  popupWindow.style.display = "none";
});

// Event listener for delete-button
deleteBookButton.addEventListener('click', () => {
  if (confirm(`Are you sure you want to delete "${currentBookTitle}"?`)) {
    let books = getBooksFromLocalStorage().filter(book => book.title !== currentBookTitle);
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
    popupWindow.style.display = "none";
    updateBookCounter();
  }
});

// Function to get books from localStorage
function getBooksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('books')) || [];
}

// Function to save book to localStorage
function saveBookToLocalStorage(book) {
  let books = getBooksFromLocalStorage();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
}

// Function to update book counter
function updateBookCounter() {
  const books = getBooksFromLocalStorage();
  bookCounter.textContent = `Total Books Read: ${books.length}`;
}

// Function to load books from localStorage when page loads
function displayBooks() {
  bookList.innerHTML = "";
  const books = getBooksFromLocalStorage();
  if (books.length === 0) {
    bookList.innerHTML = "<p id='no-books-text' style='color: white; text-align: center; font-size: 18px;'>No books added yet!</p>";
  } else {
    document.getElementById('no-books-text')?.remove();
    books.forEach(displayBook);
  }
  updateBookCounter();
}

bookForm.addEventListener('submit', addBook);
window.onload = () => {
  displayBooks();
  updateBookCounter();
};
