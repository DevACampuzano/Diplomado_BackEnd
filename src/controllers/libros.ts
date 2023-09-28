import { Request, Response } from "express";
import { ModelBooks, ModelLoans, ModelUser } from "../models";
import helpers from "../helpers";
import db from "../db/connection";
import { UploadedFile } from "express-fileupload";
import { FilesController } from "../utils";
import { ResultGetFile } from "../utils/Files";
import { Op } from "sequelize";
const { salveFile, getFile, deleteFile } = FilesController;
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

    if (where.gt) {
      const keys = Object.keys(where.gt);
      keys.forEach((item) => {
        where[item] = { ...where[item], [Op.gt]: where.gt };
      });
      delete where.gt;
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
  const { id } = req.params;
  const { decoded, titulo, autor, descripcion, disponibilidad } = req.body;
  try {
    let foto: UploadedFile | UploadedFile[] | undefined = undefined;
    if (req.files) {
      foto = req.files.foto;
    }

    const validate = await validarPermisos(decoded, 3, 10);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const book = await ModelBooks.findOne({ where: { id } }).then((book) =>
      JSON.parse(JSON.stringify(book))
    );
    let newPhoto;
    if (foto) {
      newPhoto = await salveFile(foto as UploadedFile, "book", id, "image");
      newPhoto = "book/" + newPhoto;
      if (book.foto) {
        await deleteFile(book.foto);
      }
    }

    const updatedBook = await ModelBooks.update(
      { titulo, autor, descripcion, disponibilidad, foto: newPhoto },
      { where: { id }, transaction }
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

const loanBook = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { decoded, id_libro } = req.body;
  try {
    const validate = await validarPermisos(decoded, 5, 10);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const book = await ModelBooks.findOne({ where: { id: id_libro } }).then(
      (book) => JSON.parse(JSON.stringify(book))
    );

    if (book.disponibilidad === 0) {
      await transaction.rollback();
      return res.status(404).json({
        estado: false,
        msg: "No hay ejemplares disponibles.",
      });
    }

    await ModelBooks.update(
      { disponibilidad: book.disponibilidad - 1 },
      { transaction, where: { id: id_libro } }
    );

    const createdLoan = await ModelLoans.create(
      { id_libro, id_usuario: decoded.id },
      { transaction }
    );

    transaction.commit();
    return res.status(201).json({
      estado: true,
      createdLoan,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador. Error: Book-Delete-Controller-0004.",
    });
  }
};

const getLoanBook = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 5, 10);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const loanBooks = await ModelLoans.findAll({
      where: { ...where, id_usuario: decoded.id, estado: true },
      include: [
        {
          model: ModelBooks,
          as: "Libros",
          where: { estado: true },
          required: true,
        },
        {
          model: ModelUser,
          as: "Usuario",
          where: { estado: true },
          attributes: {
            exclude: ["password"],
          },
          required: true,
        },
      ],
    }).then((loanBooks) => JSON.parse(JSON.stringify(loanBooks)));

    if (loanBooks.length === 0) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra prestamos registrados." });
    }

    return res.status(200).json({ estado: true, loanBooks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador. Error: Book-Delete-Controller-0005.",
    });
  }
};

const returnBook = async (req: Request, res: Response) => {
  const { decoded, id } = req.body;
  const transaction = await db.transaction();
  try {
    const validate = await validarPermisos(decoded, 5, 10);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const loan = await ModelLoans.findOne({
      where: { id },
      include: [
        {
          model: ModelBooks,
          as: "Libros",
          where: { estado: true },
          required: true,
        },
      ],
    }).then((book) => JSON.parse(JSON.stringify(book)));

    await ModelBooks.update(
      { disponibilidad: loan.Libros.disponibilidad + 1 },
      { transaction, where: { id: loan.Libros.id } }
    );

    const fecha_devolucion = new Date();
    const updateLoan = await ModelLoans.update(
      { fecha_devolucion },
      { transaction, where: { id } }
    );

    if (updateLoan[0] <= 0) {
      await transaction.rollback();
      return res.status(404).json({
        estado: false,
        msg: "Error al realizar el préstamo.",
      });
    }

    transaction.commit();

    return res.status(200).json({
      estado: true,
      prestamo: { fecha_devolucion, id }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador. Error: Book-Delete-Controller-0006.",
    });
  }
};

export default {
  getBook,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  loanBook,
  getLoanBook,
  returnBook,
};
