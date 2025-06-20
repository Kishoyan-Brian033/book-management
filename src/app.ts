interface Book {
  id: string;
  title: string;
  description: string;
  image?: string;
  isBorrowed: boolean;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  borrowedBooks: string[];
}

let books: Book[] = JSON.parse(localStorage.getItem("books") || "[]");
let members: Member[] = JSON.parse(localStorage.getItem("members") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("book-form") as HTMLFormElement;
  const memberForm = document.getElementById("member-form") as HTMLFormElement;
  const borrowForm = document.getElementById("borrow-form") as HTMLFormElement;
  const returnForm = document.getElementById("return-form") as HTMLFormElement;
  const transactionsPanel = document.getElementById("transactions-panel") as HTMLElement;

  document.getElementById("toggle-transactions")?.addEventListener("click", () => {
    transactionsPanel.style.display = transactionsPanel.style.display === "none" ? "block" : "none";
    displaytransactions();
  });

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = (document.getElementById("book-title") as HTMLInputElement).value;
    const description = (document.getElementById("book-description") as HTMLTextAreaElement).value;
    const fileInput = document.getElementById("book-image") as HTMLInputElement;
    const image = fileInput.files && fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : "";
    const editId = bookForm.getAttribute("data-editing-id");

    if (editId) {
      const book = books.find(b => b.id === editId);
      if (book) {
        book.title = title;
        book.description = description;
        bookForm.removeAttribute("data-editing-id");
      }
    } else {
      const book: Book = {
        id: crypto.randomUUID(),
        title,
        description,
        image,
        isBorrowed: false,
      };
      books.push(book);
    }

    saveToStorage("books", books);
    dispalybooks();
    bookForm.reset();
  });

  memberForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("member-name") as HTMLInputElement).value;
    const email = (document.getElementById("member-email") as HTMLInputElement).value;
    const phone = (document.getElementById("member-phone") as HTMLInputElement).value;
    const editId = memberForm.getAttribute("data-editing-id");

    if (editId) {
      const member = members.find(m => m.id === editId);
      if (member) {
        member.name = name;
        member.email = email;
        member.phone = phone;
        memberForm.removeAttribute("data-editing-id");
      }
    } else {
      const member: Member = {
        id: crypto.randomUUID(),
        name,
        email,
        phone,
        borrowedBooks: []
      };
      members.push(member);
    }

    saveToStorage("members", members);
    displaymembers();
    memberForm.reset();
  });

  borrowForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const memberId = (document.getElementById("borrow-member") as HTMLSelectElement).value;
    const bookId = (document.getElementById("borrow-book") as HTMLSelectElement).value;

    const member = members.find(m => m.id === memberId);
    const book = books.find(b => b.id === bookId);

    if (book && member && !book.isBorrowed) {
      book.isBorrowed = true;
      member.borrowedBooks.push(bookId);
      saveToStorage("books", books);
      saveToStorage("members", members);
      dispalybooks();
      displaytransactions();
    }
  });

  returnForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const memberId = (document.getElementById("return-member") as HTMLSelectElement).value;
    const bookId = (document.getElementById("return-book") as HTMLSelectElement).value;

    const member = members.find(m => m.id === memberId);
    const book = books.find(b => b.id === bookId);

    if (book && member && book.isBorrowed) {
      book.isBorrowed = false;
      member.borrowedBooks = member.borrowedBooks.filter(id => id !== bookId);
      saveToStorage("books", books);
      saveToStorage("members", members);
      dispalybooks();
      displaytransactions();
    }
  });

  dispalybooks();
  displaymembers();
  displaytransactions();
});

function saveToStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

function editBook(id: string) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  (document.getElementById("book-title") as HTMLInputElement).value = book.title;
  (document.getElementById("book-description") as HTMLTextAreaElement).value = book.description;
  const form = document.getElementById("book-form") as HTMLFormElement;
  form.setAttribute("data-editing-id", id);
}

function editMember(id: string) {
  const member = members.find(m => m.id === id);
  if (!member) return;
  (document.getElementById("member-name") as HTMLInputElement).value = member.name;
  (document.getElementById("member-email") as HTMLInputElement).value = member.email;
  (document.getElementById("member-phone") as HTMLInputElement).value = member.phone;
  const form = document.getElementById("member-form") as HTMLFormElement;
  form.setAttribute("data-editing-id", id);
}

function dispalybooks() {
  const list = document.getElementById("book-list") as HTMLElement;
  list.innerHTML = books.map(book => `
    <div data-id="${book.id}">
      <strong>${book.title}</strong> - ${book.description} ${book.isBorrowed ? '(Borrowed)' : ''}
      <button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
    </div>
  `).join("");

  list.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = (btn.parentElement as HTMLElement).getAttribute("data-id")!;
      const book = books.find(b => b.id === id);
      if (book?.isBorrowed) {
        alert("Cannot delete a borrowed book.");
        return;
      }
      books = books.filter(b => b.id !== id);
      saveToStorage("books", books);
      dispalybooks();
      displaytransactions();
    });
  });

  list.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = (btn.parentElement as HTMLElement).getAttribute("data-id")!;
      editBook(id);
    });
  });
}

function displaymembers() {
  const list = document.getElementById("member-list") as HTMLElement;
  list.innerHTML = members.map(member => `
    <div data-id="${member.id}">
      <strong>${member.name}</strong> (${member.email})
      <button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
    </div>
  `).join("");

  list.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = (btn.parentElement as HTMLElement).getAttribute("data-id")!;
      const member = members.find(m => m.id === id);
      if (member?.borrowedBooks.length) {
        alert("Cannot delete member with borrowed books.");
        return;
      }
      members = members.filter(m => m.id !== id);
      saveToStorage("members", members);
      displaymembers();
      displaytransactions();
    });
  });

  list.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = (btn.parentElement as HTMLElement).getAttribute("data-id")!;
      editMember(id);
    });
  });
}

function displaytransactions() {
  const borrowMember = document.getElementById("borrow-member") as HTMLSelectElement;
  const borrowBook = document.getElementById("borrow-book") as HTMLSelectElement;
  const returnMember = document.getElementById("return-member") as HTMLSelectElement;
  const returnBook = document.getElementById("return-book") as HTMLSelectElement;

  borrowMember.innerHTML = members.map(m => `<option value="${m.id}">${m.name}</option>`).join("");
  borrowBook.innerHTML = books.filter(b => !b.isBorrowed).map(b => `<option value="${b.id}">${b.title}</option>`).join("");
  returnMember.innerHTML = members.map(m => `<option value="${m.id}">${m.name}</option>`).join("");

  updateReturnBooks(returnMember.value);

  returnMember.addEventListener("change", () => {
    updateReturnBooks(returnMember.value);
  });

  function updateReturnBooks(memberId: string) {
    const member = members.find(m => m.id === memberId);
    returnBook.innerHTML = member?.borrowedBooks.map(id => {
      const book = books.find(b => b.id === id);
      return book ? `<option value="${book.id}">${book.title}</option>` : "";
    }).join("") || "";
  }
}
