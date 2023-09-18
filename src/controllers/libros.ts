import { Request, Response } from "express";
import { ModelBooks } from "../models";
import helpers from "../helpers";
import db from "../db/connection";

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

    const action = await ModelBooks.findOne({
      where: { id, estado: true },
    });

    if (!action) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra el libro registrado." });
    }

    return res.json({ estado: true, action });
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

    const actions = await ModelBooks.findAll({
      where: { ...where, estado: true },
      order: [["nombre", "ASC"]],
    });

    if (actions.length === 0) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra libros." });
    }

    return res.json({ estado: true, actions });
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
  const { decoded, titulo, autor, descripcion, disponibilidad, foto } =
    req.body;
  try {
    const validate = await validarPermisos(decoded, 2, 10);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const userGroup = await ModelBooks.create(
      { titulo, autor, descripcion, disponibilidad },
      { transaction }
    );

    await transaction.commit();
    return res.status(201).json({ estado: true, userGroup });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Users-Group-Controller-0003.",
    });
  }
};
export default {
  getBook,
  getBooks,
  createBook,
};
