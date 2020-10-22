// Book Class : Represents book

class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

// UI Class : Handle UI Tasks

class UI {
	static displayBooks() {
		const books = Store.getBooks();

		books.forEach((book) => UI.addBookToList(book));
	}

	static addBookToList(book) {
		const list = document.querySelector('#book-list');
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href = "#" class = "btn btn-danger btn-sm delete">Delete</a></td>
		`;
		list.appendChild(row);
	}

	
	static deleteBook(ele) {
		if(ele.classList.contains('delete')) {
			ele.parentElement.parentElement.remove();
		}
	}
	static showAlerts(message, className) {
		const div = document.createElement('div')	;
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('#book-form');
		container.insertBefore(div, form);
		//vanish this within few seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}
	static clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
	
}

// Store Class : Handles Storage

class Store {
	static getBooks() {
		let books;
		if(localStorage.getItem('books') === null) {
			books = [];
		}
		else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	static addBooks(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBooks(isbn) {
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if(book.isbn == isbn) {
				books.splice(index, 1);
			}
		});	

		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event : Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event : Add a Book

document.querySelector('#book-form').addEventListener('submit', (e) => {
	// Prevent submit 
	e.preventDefault();
	// Get form values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	//validate book fields

	if(title === '' || author === '' || isbn === '') {
		UI.showAlerts('Please fill all the details !', 'danger');
	} else {

		// instantiate book
		const book = new Book(title, author, isbn);

		// Adding book to UI
		UI.addBookToList(book);

		// Adding book to local storage
		Store.addBooks(book);

		// show succes alert
		UI.showAlerts('Book added succesfully !', 'success');

		//clear fields
		UI.clearFields();

	}
});


// Event : Remove a Book

document.querySelector('#book-list').addEventListener('click', (e) => {
	// To remove book from UI
	UI.deleteBook(e.target);

	// To remove book from Local Storage
	Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

	UI.showAlerts('Book Removed', 'success');
})

