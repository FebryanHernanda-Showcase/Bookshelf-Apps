/* Local data storage */
const saveDataLocalStorage = () => {
  localStorage.setItem("bookData", JSON.stringify(buku));
};

const loadDataLocalStorage = () => {
  const dataSaved = localStorage.getItem("bookData");
  if (dataSaved) {
    buku = JSON.parse(dataSaved);

    buku.forEach((item) => {
      item.year = Number(item.year);
    });

    showBukuComplete();
    showBukuNotComplete();
  }
};

/* DOM Content Loaded */

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  loadDataLocalStorage();

  const searchButton = document.getElementById("searchSubmit");
  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const searchForm = document.getElementById("searchBook");

    if (!searchForm.checkValidity()) {
      searchForm.reportValidity();
      return;
    }
    resultBook();
  });

  const formButton = document.getElementById("bookFormSubmit");

  formButton.addEventListener("click", (e) => {
    e.preventDefault();
    const bookForm = document.getElementById("bookForm");

    if (!bookForm.checkValidity()) {
      bookForm.reportValidity();
      return;
    }
    getInputForm();
    bookForm.reset();
  });

  const cancelEditButton = document.getElementById("cancelEditBookFormButton");
  cancelEditButton.addEventListener("click", (e) => {
    cancelEditBook();
  });

  const clearSearchButton = document.getElementById("clearSearchButton");
  clearSearchButton.addEventListener("click", (e) => {
    e.preventDefault();
    clearUISearchResult();
    const searchForm = document.getElementById("searchBook");
    searchForm.reset();
  });
});

/* Generate Booklist */
let buku = [];

const generateId = () => {
  return +new Date();
};

const bookItem = (id, title, author, year, image, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    image,
    isComplete,
  };
};

const getInputForm = () => {
  const defautImage =
    "https://cdn.pixabay.com/photo/2024/06/16/15/23/book-8833643_640.jpg";

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const image = document.getElementById("bookFormImage").value || defautImage;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  console.log(`${title}, ${author}, ${year}, ${image}, ${isComplete}`);

  const booksId = generateId();
  const item = bookItem(booksId, title, author, year, image, isComplete);

  buku.push(item);
  saveDataLocalStorage();
  showBukuNotComplete();
  showBukuComplete();
};

/* Search Book Function */

const searchBook = () => {
  const searchInput = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const searchBook = buku.filter((item) =>
    item.title.toLowerCase().includes(searchInput)
  );

  return searchBook;
};

const resultBook = () => {
  const showResults = document.getElementById("searchResults");
  const result = searchBook();

  if (!result.length) {
    alert("book not found");
    return;
  }

  let cards = "";
  result.forEach((item) => {
    cards += resultUIBook(item);
  });

  showResults.innerHTML = cards;

  if (result.length > 0) {
    const clearButton = document.getElementById("clearSearchButton");
    clearButton.style.display = "inline-block";
  }
};

const clearUISearchResult = () => {
  const uiShow = document.getElementById("searchResults");
  uiShow.innerHTML = emptySearchContent();

  const searchForm = document.getElementById("searchBook");
  searchForm.reset();

  const clearButton = document.getElementById("clearSearchButton");
  clearButton.style.display = "none";
};

const emptySearchContent = () => {
  return `
   <div class="empty-searchContent" id="emptySearchContent">
          <img src="assets/Books.png" alt="Reading books with glasses and coffee" id="reading-books">
          <p>"The more that you read, the more things you will know, the more that you learn, the more places you'll go."</p>
          <br>
          <h6>Dr. Seuss <span id="titleQuotes"> <br>American author and cartoonist</span></h6>
    </div>
  `;
};

const resultUIBook = (data) => {
  const status = data.isComplete;
  let statusBook = status ? "Finished" : "Unfinished";
  let bookId = status ? "buttonFinished" : "";

  return `
  <div data-bookid="${data.id}" data-testid="bookItem"  class="card-content">
        <div class="card-image">
              <img src="${data.image}" alt="Book Cover Images">
        </div>
        <div class="card-item">
          <h3 data-testid="bookItemTitle">${data.title}</h3>
           <p data-testid="bookItemAuthor">${data.author}</p>
           <p data-testid="bookItemYear">${data.year}</p>
           <button id="${bookId}" aria-label="${statusBook}">${statusBook}</button>
        </div>
        <div class="card-button">
           <button data-testid="bookItemEditButton" onClick="showEditBook(${data.id})" aria-label="Edit book"><i class="fa-solid fa-pen-to-square fa-lg "></i></button>
           <button data-testid="bookItemDeleteButton" onClick="deleteBook(${data.id})" aria-label="Delete book"><i class="fa-solid fa-trash fa-lg"></i></button>
      </div>
   </div>

  `;
};

/* Edit Book Function */

const showEditBook = (id) => {
  const bookToEdit = buku.find((book) => book.id === id);

  const editForm = document.getElementById("containerEditForm");
  editForm.style.display = "block";

  document.getElementById("editTitle").value = bookToEdit.title;
  document.getElementById("editBookFormAuthor").value = bookToEdit.author;
  document.getElementById("editBookFormYear").value = bookToEdit.year;
  document.getElementById("newBookFormImage").value = bookToEdit.image;

  const editSubmitButton = document.getElementById("EditBookFormButton");

  const newButton = editSubmitButton.cloneNode(true);
  editSubmitButton.parentNode.replaceChild(newButton, editSubmitButton);

  newButton.addEventListener("click", (e) => {
    e.preventDefault();
    editBook(id);

    clearUISearchResult();

    document.getElementById("modal").style.display = "none";
  });
  document.getElementById("editBookForm").style.display = "block";
  document.getElementById("modal").style.display = "block";
};

const editBook = (id) => {
  const defautImage =
    "https://cdn.pixabay.com/photo/2024/06/16/15/23/book-8833643_640.jpg";

  const newTitle = document.getElementById("editTitle").value;
  const newAuthor = document.getElementById("editBookFormAuthor").value;
  const newYear = document.getElementById("editBookFormYear").value;
  const newImage =
    document.getElementById("newBookFormImage").value || defautImage;
  const newIsComplete = document.getElementById(
    "editBookFormIsComplete"
  ).checked;

  buku = buku.map((obj) => {
    if (obj.id === id) {
      return {
        id: obj.id,
        title: newTitle,
        author: newAuthor,
        year: newYear,
        image: newImage,
        isComplete: newIsComplete,
      };
    }
    return obj;
  });

  saveDataLocalStorage();
  showBukuNotComplete();
  showBukuComplete();

  const editForm = document.getElementById("containerEditForm");
  editForm.style.display = "none";
};

const cancelEditBook = () => {
  const editForm = document.getElementById("containerEditForm");
  editForm.style.display = "none";
  editForm.reset();
};

/* Delete Book Function */

const deleteBook = (id) => {
  const isDelete = confirm("are you sure want to delete this book?");

  if (isDelete) {
    buku = buku.filter((item) => item.id !== id);
    clearUISearchResult();
    saveDataLocalStorage();
    showBukuNotComplete();
    showBukuComplete();
  }
};

/* Read Book Function */

const finishRead = (index) => {
  buku[index].isComplete = true;
  saveDataLocalStorage();
  showBukuNotComplete();
  showBukuComplete();
};

const undoRead = (index) => {
  buku[index].isComplete = false;
  saveDataLocalStorage();
  showBukuNotComplete();
  showBukuComplete();
};

const showBukuNotComplete = () => {
  const notComplete = document.getElementById("incompleteBookList");
  notComplete.innerHTML = "";

  let rakNotComplete = "";
  buku.forEach((item, index) => {
    if (!item.isComplete) {
      rakNotComplete += showUINotComplete(item, index);
    }
  });

  const emptyContent = document.getElementById("readEmptyContent");
  emptyContent.style.display = !rakNotComplete ? "block" : "none";

  notComplete.innerHTML = rakNotComplete;
};

const showUINotComplete = (data, index) => {
  const status = data.isComplete;
  let statusBook = status ? "Finished" : "Unfinished";

  return `
         <div data-bookid="${data.id}" data-testid="bookItem" class="card-content">
          <div class="card-image">
                <img src="${data.image}" alt="Book Cover Images">
          </div>
          <div class="card-item">
             <h3 data-testid="bookItemTitle">${data.title}</h3>
             <p data-testid="bookItemAuthor">${data.author}</p>
             <p data-testid="bookItemYear">${data.year}</p>
             <button aria-label="${statusBook}">${statusBook}</button>
          </div>
             <div class="card-button">
                 <button data-testid="bookItemIsCompleteButton" onClick="finishRead(${index})" aria-label="Mark as finished"><i class="fa-solid fa-check-to-slot fa-lg"></i></button>
                 <button data-testid="bookItemDeleteButton" onClick="deleteBook(${data.id})" aria-label="Delete book"><i class="fa-solid fa-trash fa-lg"></i></button>
                 <button data-testid="bookItemEditButton" onClick="showEditBook(${data.id})" aria-label="Edit book"><i class="fa-solid fa-pen-to-square fa-lg"></i></button>
             </div>
         </div>
     `;
};

const showBukuComplete = () => {
  const bookCompelete = document.getElementById("completeBookList");
  bookCompelete.innerHTML = "";

  let rakComplete = "";
  buku.forEach((item, index) => {
    if (item.isComplete) {
      rakComplete += showUIComplete(item, index);
    }
  });

  const emptyContent = document.getElementById("finishEmptyContent");
  emptyContent.style.display = !rakComplete ? "block" : "none";

  bookCompelete.innerHTML = rakComplete;
};

const showUIComplete = (data, index) => {
  const status = data.isComplete;
  let statusBook = status ? "Finished" : "Unfinished";

  return `
        <div data-bookid="${data.id}" data-testid="bookItem" class="card-content">
          <div class="card-image">
                <img src="${data.image}" alt="Book Cover Images">
          </div>
          <div class="card-item">
             <h3 data-testid="bookItemTitle">${data.title}</h3>
             <p data-testid="bookItemAuthor">${data.author}</p>
             <p data-testid="bookItemYear">${data.year}</p>
             <button id="buttonFinished" aria-label="${statusBook}">${statusBook}</button>
          </div>
             <div class="card-button">
                 <button data-testid="bookItemIsCompleteButton" onClick="undoRead(${index})" aria-label="Mark as unfinished"><i class="fa-solid fa-rotate-left fa-lg" aria-hidden="true"></i></button>
                 <button data-testid="bookItemDeleteButton" onClick="deleteBook(${data.id})" aria-label="Delete book"><i class="fa-solid fa-trash fa-lg" aria-hidden="true"></i></button>
                 <button data-testid="bookItemEditButton" onClick="showEditBook(${data.id})" aria-label="Edit book"><i class="fa-solid fa-pen-to-square fa-lg" aria-hidden="true"></i></button>
             </div>
         </div>
      `;
};
