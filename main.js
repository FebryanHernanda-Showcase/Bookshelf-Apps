let buku = [];

const saveDataLocalStorage = () => {
  localStorage.setItem("bookData", JSON.stringify(buku));
};

const loadDataLocalStorage = () => {
  const dataSaved = localStorage.getItem("bookData");
  if (dataSaved) {
    buku = JSON.parse(dataSaved);
    showBukuComplete();
    showBukuNotComplete();
  }
};

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
    const searchForm = document.getElementById("searchBook");

    if (!searchForm.checkValidity()) {
      searchForm.reportValidity();
      return;
    }
    clearUISearchResult();
    searchForm.reset();
  });
});

const generateId = () => {
  return +new Date();
};

const bookItem = (
  idBuku,
  judulBuku,
  penulisBuku,
  tahunBuku,
  image,
  isComplete
) => {
  return {
    idBuku,
    judulBuku,
    penulisBuku,
    tahunBuku,
    image,
    isComplete,
  };
};

const getInputForm = () => {
  const defautImage =
    "https://cdn.pixabay.com/photo/2024/06/16/15/23/book-8833643_640.jpg";

  const judul = document.getElementById("bookFormTitle").value;
  const penulis = document.getElementById("bookFormAuthor").value;
  const tahun = document.getElementById("bookFormYear").value;
  const image = document.getElementById("bookFormImage").value || defautImage;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const idBuku = generateId();
  const item = bookItem(idBuku, judul, penulis, tahun, image, isComplete);

  buku.push(item);
  saveDataLocalStorage();
  showBukuNotComplete();
  showBukuComplete();
};

const searchBook = () => {
  const searchInput = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const searchResult = buku.filter((item) =>
    item.judulBuku.toLowerCase().includes(searchInput)
  );

  return searchResult;
};

const resultBook = () => {
  const uiShow = document.getElementById("searchResults");

  const result = searchBook();
  if (!result.length) {
    alert("Buku tidak ditemukan !");
    return;
  }

  let cards = "";
  result.forEach((item) => {
    cards += resultUIBook(item);
  });

  uiShow.innerHTML = cards;

  if (result.length > 0) {
    const clearButton = document.getElementById("clearSearchButton");
    clearButton.style.display = "inline-block";
  }
};

const clearUISearchResult = () => {
  const uiShow = document.getElementById("searchResults");
  uiShow.innerHTML = `
        <div class="empty-searchContent" id="emptySearchContent">
          <img src="assets/Books.png" alt="Reading books with glasses and coffee" id="reading-books">
          <p>"The more that you read, the more things you will know, the more that you learn, the more places you'll go."</p>
          <br>
          <p>Dr. Seuss <span> <br>American author and cartoonist</span></p>
        </div>
        `;

  const clearButton = document.getElementById("clearSearchButton");
  clearButton.style.display = "none";
};

const resultUIBook = (data) => {
  const status = data.isComplete;
  let statusBook = status ? "Finished" : "Unfinished";
  let bookId = status ? "buttonFinished" : "";

  const colorStatus = document.getElementById("statusBook");

  // const searchInput = document
  //   .getElementById("searchBookTitle")
  //   .value.toLowerCase();

  return `
  <div class="card-content">
        <div class="card-image">
              <img src="${data.image}" alt="">
        </div>
        <div class="card-item">
          <h3 data-testid="bookItemTitle">${data.judulBuku}</h3>
           <p data-testid="bookItemAuthor">${data.penulisBuku}</p>
           <p data-testid="bookItemYear">${data.tahunBuku}</p>
           <button id="${bookId}">${statusBook}</button>
        </div>
        <div class="card-button">
           <button data-testid="bookItemEditButton" onClick="showEditBook(${data.idBuku})"><i class="fa-solid fa-pen-to-square fa-xl"></i></button>
           <button data-testid="bookItemDeleteButton" onClick="deleteBook(${data.idBuku})"><i class="fa-solid fa-trash fa-xl"></i></button>
      </div>
   </div>

  `;
};

const showEditBook = (idBuku) => {
  const bookToEdit = buku.find((book) => book.idBuku === idBuku);

  const editForm = document.getElementById("containerEditForm");
  editForm.style.display = "block";

  document.getElementById("editTitle").value = bookToEdit.judulBuku;
  document.getElementById("editBookFormAuthor").value = bookToEdit.penulisBuku;
  document.getElementById("editBookFormYear").value = bookToEdit.tahunBuku;
  document.getElementById("newBookFormImage").value = bookToEdit.image;

  const editSubmitButton = document.getElementById("EditBookFormButton");

  const newButton = editSubmitButton.cloneNode(true);
  editSubmitButton.parentNode.replaceChild(newButton, editSubmitButton);

  newButton.addEventListener("click", (e) => {
    e.preventDefault();
    editBook(idBuku);
  });
  document.getElementById("editBookForm").style.display = "block";
};

const editBook = (idBuku) => {
  const defautImage =
    "https://cdn.pixabay.com/photo/2024/06/16/15/23/book-8833643_640.jpg";

  const newJudulBuku = document.getElementById("editTitle").value;
  const newPenulisBuku = document.getElementById("editBookFormAuthor").value;
  const newTahunBuku = document.getElementById("editBookFormYear").value;
  const newImage =
    document.getElementById("newBookFormImage").value || defautImage;
  const newIsComplete = document.getElementById(
    "editBookFormIsComplete"
  ).checked;

  buku = buku.map((obj) => {
    if (obj.idBuku === idBuku) {
      return {
        idBuku: obj.idBuku,
        judulBuku: newJudulBuku,
        penulisBuku: newPenulisBuku,
        tahunBuku: newTahunBuku,
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
  // editForm.reset();
};

const cancelEditBook = () => {
  const editForm = document.getElementById("containerEditForm");
  editForm.style.display = "none";
  editForm.reset();
};

const deleteBook = (idBuku) => {
  buku = buku.filter((item) => item.idBuku !== idBuku);
  saveDataLocalStorage();
  showBukuNotComplete();
  showBukuComplete();
};

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
         <div data-bookid="456456456" data-testid="bookItem" class="card-content">
          <div class="card-image">
                <img src="${data.image}" alt="">
          </div>
          <div class="card-item">
             <h3 data-testid="bookItemTitle">${data.judulBuku}</h3>
             <p data-testid="bookItemAuthor">${data.penulisBuku}</p>
             <p data-testid="bookItemYear">${data.tahunBuku}</p>
             <button>${statusBook}</button>
          </div>
             <div class="card-button">
                 <button data-testid="bookItemIsCompleteButton" onClick="finishRead(${index})"><i class="fa-solid fa-check-to-slot fa-xl"></i></button>
                 <button data-testid="bookItemDeleteButton" onClick="deleteBook(${data.idBuku})"><i class="fa-solid fa-trash fa-xl"></i></button>
                 <button data-testid="bookItemEditButton" onClick="showEditBook(${data.idBuku})"><i class="fa-solid fa-pen-to-square fa-xl"></i></button>
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
        <div data-bookid="456456456" data-testid="bookItem" class="card-content">
          <div class="card-image">
                <img src="${data.image}" alt="">
          </div>
          <div class="card-item">
             <h3 data-testid="bookItemTitle">${data.judulBuku}</h3>
             <p data-testid="bookItemAuthor">${data.penulisBuku}</p>
             <p data-testid="bookItemYear">${data.tahunBuku}</p>
             <button id="buttonFinished">${statusBook}</button>
          </div>
             <div class="card-button">
                 <button data-testid="bookItemIsCompleteButton" onClick="undoRead(${index})"><i class="fa-solid fa-rotate-left fa-xl"></i></button>
                 <button data-testid="bookItemDeleteButton" onClick="deleteBook(${data.idBuku})"><i class="fa-solid fa-trash fa-xl"></i></button>
                 <button data-testid="bookItemEditButton" onClick="showEditBook(${data.idBuku})"><i class="fa-solid fa-pen-to-square fa-xl"></i></button>
             </div>
         </div>
      `;
};
