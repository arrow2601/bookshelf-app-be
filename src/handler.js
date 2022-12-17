const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    insertedAt,
    updatedAt,
    reading,
    finished,
  };

  if (newBook.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name: nama } = request.query;

  if (nama !== undefined) {
    const filterbuku = books.filter((buku) => buku.name.toLowerCase().includes(nama.toLowerCase()));
    const isibuku = filterbuku.map(({ id, name, publisher }) => ({ id, name, publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: isibuku,
      },
    });
    return response;
  }
  if (reading === '1') {
    const filterbuku = books.filter((buku) => buku.reading === true);
    const isibuku = filterbuku.map(({ id, name, publisher }) => ({ id, name, publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: isibuku,
      },
    });
    return response;
  }

  if (reading === '0') {
    const filterbuku = books.filter((buku) => buku.reading === false);
    const isibuku = filterbuku.map(({ id, name, publisher }) => ({ id, name, publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: isibuku,
      },
    });
    return response;
  }

  if (finished === '1') {
    const filterbuku = books.filter((buku) => buku.finished === true);
    const isibuku = filterbuku.map(({ id, name, publisher }) => ({ id, name, publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: isibuku,
      },
    });
    return response;
  }

  if (finished === '0') {
    const filterbuku = books.filter((buku) => buku.finished === false);
    const isibuku = filterbuku.map(({ id, name, publisher }) => ({ id, name, publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: isibuku,
      },
    });
    return response;
  }
  const isibuku = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  const response = h.response({
    status: 'success',
    data: {
      books: isibuku,
    },
  });
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',

  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const isname = { name };

  if (isname.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
