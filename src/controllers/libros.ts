import { Request, Response } from "express";
import { ModelBooks } from "../models";
import helpers from "../helpers";
import db from "../db/connection";
import { UploadedFile } from "express-fileupload";
import { FilesController } from "../utils";
import { ResultGetFile } from "../utils/Files";

const { salveFile, getFile } = FilesController;
const { validarPermisos } = helpers;

const getBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 10);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const book = await ModelBooks.findOne({
      where: { id, estado: true },
    }).then((book) => JSON.parse(JSON.stringify(book)));

    if (!book) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra el libro registrado." });
    }

    if (book.foto) {
      book.foto = await getFile(book.foto);
    }

    return res.json({ estado: true, book });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Books-Controller-0001.",
    });
  }
};

const getBooks = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 10);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const books = await ModelBooks.findAll({
      where: { ...where, estado: true },
      order: [["titulo", "ASC"]],
    }).then((book) => JSON.parse(JSON.stringify(book)));

    if (books.length === 0) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra libros." });
    }

    await Promise.all(
      books.map(async (book: { foto: string | ResultGetFile }) => {
        if (book.foto) {
          book.foto = await getFile(book.foto as string);
        }
        return book;
      })
    );

    return res.json({ estado: true, books });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Books-Controller-0002.",
    });
  }
};

const createBook = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { decoded, titulo, autor, descripcion, disponibilidad } = req.body;
  try {
    let foto: UploadedFile | UploadedFile[] | undefined = undefined;
    if (req.files) {
      foto = req.files.foto;
    }

    const validate = await validarPermisos(decoded, 2, 10);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const book = await ModelBooks.create(
      { titulo, autor, descripcion, disponibilidad },
      { transaction }
    ).then((book) => JSON.parse(JSON.stringify(book)));

    if (foto) {
      const newPhoto =
        "book/" +
        (await salveFile(foto as UploadedFile, "book", book.id, "image"));

      await ModelBooks.update(
        { foto: newPhoto },
        { where: { id: book.id, estado: true }, transaction }
      );
    }

    await transaction.commit();
    return res.status(201).json({ estado: true, book });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Users-Group-Controller-0003.",
    });
  }
};

const updateBook = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { decoded, bookId, titulo, autor, descripcion, disponibilidad, foto } =
    req.body;

  try {
    const validate = await validarPermisos(decoded, 3, 10);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const updatedBook = await ModelBooks.update(
      { titulo, autor, descripcion, disponibilidad },
      { where: { id: bookId }, transaction }
    );

    await transaction.commit();
    return res.status(201).json({ estado: true, updatedBook });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador. Error: Book-Update-Controller-0003.",
    });
  }
};

const deleteBook = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { id } = req.params;
  const { decoded } = req.body;

  try {
    const validate = await validarPermisos(decoded, 4, 10);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const deletedBook = await ModelBooks.update(
      { estado: false },
      { where: { id: id }, transaction }
    );

    await transaction.commit();
    return res.status(200).json({ estado: true, deletedBook });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador. Error: Book-Delete-Controller-0003.",
    });
  }
};
export default {
  getBook,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
