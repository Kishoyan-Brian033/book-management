// index.ts

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

const books: Book[] = JSON.parse(localStorage.getItem("books") || "[]");
const members: Member[] = JSON.parse(localStorage.getItem("members") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("book-form") as HTMLFormElement;
  const memberForm = document.getElementById("member-form") as HTMLFormElement;
  const borrowForm = document.getElementById("borrow-form") as HTMLFormElement;
  const returnForm = document.getElementById("return-form") as HTMLFormElement;
  const transactionsPanel = document.getElementById("transactions-panel") as HTMLElement;

  document.getElementById("toggle-transactions")?.addEventListener("click", () => {
    transactionsPanel.style.display = transactionsPanel.style.display === "none" ? "block" : "none";
    populateTransactionSelects();
  });

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = (document.getElementById("book-title") as HTMLInputElement).value;
    const description = (document.getElementById("book-description") as HTMLTextAreaElement).value;
    const fileInput = document.getElementById("book-image") as HTMLInputElement;
    const image = fileInput.files && fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : "";

    const book: Book = {
      id: crypto.randomUUID(),
      title,
      description,
      image,
      isBorrowed: false,
    };

    books.push(book);
    saveToStorage("books", books);
    renderBooks();
    bookForm.reset();
  });

  memberForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("member-name") as HTMLInputElement).value;
    const email = (document.getElementById("member-email") as HTMLInputElement).value;
    const phone = (document.getElementById("member-phone") as HTMLInputElement).value;

    const member: Member = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      borrowedBooks: []
    };

    members.push(member);
    saveToStorage("members", members);
    renderMembers();
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
      renderBooks();
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
      renderBooks();
    }
  });

  renderBooks();
  renderMembers();
});

function saveToStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderBooks() {
  const list = document.getElementById("book-list") as HTMLElement;
  list.innerHTML = books.map(book => `
    <div>
      <strong>${book.title}</strong> - ${book.description} ${book.isBorrowed ? '(Borrowed)' : ''}
    </div>
  `).join("");
}

function renderMembers() {
  const list = document.getElementById("member-list") as HTMLElement;
  list.innerHTML = members.map(member => `
    <div>
      <strong>${member.name}</strong> (${member.email})
    </div>
  `).join("");
}

function populateTransactionSelects() {
  const borrowMember = document.getElementById("borrow-member") as HTMLSelectElement;
  const borrowBook = document.getElementById("borrow-book") as HTMLSelectElement;
  const returnMember = document.getElementById("return-member") as HTMLSelectElement;
  const returnBook = document.getElementById("return-book") as HTMLSelectElement;

  borrowMember.innerHTML = members.map(m => `<option value="${m.id}">${m.name}</option>`).join("");
  borrowBook.innerHTML = books.filter(b => !b.isBorrowed).map(b => `<option value="${b.id}">${b.title}</option>`).join("");
  returnMember.innerHTML = members.map(m => `<option value="${m.id}">${m.name}</option>`).join("");

  const selectedReturnMemberId = returnMember.value;
  const selectedMember = members.find(m => m.id === selectedReturnMemberId);
  returnBook.innerHTML = selectedMember?.borrowedBooks.map(id => {
    const book = books.find(b => b.id === id);
    return book ? `<option value="${book.id}">${book.title}</option>` : "";
  }).join("") || "";

  returnMember.addEventListener("change", () => {
    const memberId = returnMember.value;
    const member = members.find(m => m.id === memberId);
    returnBook.innerHTML = member?.borrowedBooks.map(id => {
      const book = books.find(b => b.id === id);
      return book ? `<option value="${book.id}">${book.title}</option>` : "";
    }).join("") || "";
  });
}
