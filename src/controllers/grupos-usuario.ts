import { Request, Response } from "express";
import { ModelUsersGroup } from "../models";
import helpers from "../helpers";
import db from "../db/connection";

const { validarPermisos } = helpers;

const getUserGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 7);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const userGroup = await ModelUsersGroup.findOne({
      where: { id, estado: true },
    });

    if (!userGroup) {
      return res.status(401).json({
        estado: false,
        msg: "No se encuentra el grupo de usuario registrado.",
      });
    }

    return res.json({ estado: true, userGroup });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Users-Group-Controller-0001.",
    });
  }
};

const getUsersGroups = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 7);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const userGroup = await ModelUsersGroup.findAll({
      where: { ...where, estado: true },
    });

    if (userGroup.length === 0) {
      return res.status(401).json({
        estado: false,
        msg: "No se encontraron grupo de usuario registrado.",
      });
    }

    return res.json({ estado: true, userGroup });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Users-Group-Controller-0002.",
    });
  }
};

const createUserGroup = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { decoded, nombre } = req.body;
  try {
    const validate = await validarPermisos(decoded, 2, 7);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const userGroup = await ModelUsersGroup.create({ nombre }, { transaction });

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

const updateUserGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await db.transaction();
  const { decoded, nombre } = req.body;
  try {
    const validate = await validarPermisos(decoded, 3, 7);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const userGroup = await ModelUsersGroup.update(
      { nombre },
      {
        where: {
          id,
          estado: true,
        },
        transaction,
      }
    );

    if (!userGroup) {
      return res.status(500).json({
        estado: false,
        msg: "No se pudo actualizar el grupo de usuario.",
      });
    }

    await transaction.commit();

    return res.json({
      msg: "El grupo de usuario se actualizo con exito",
      estado: true,
      userGroup,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Users-Group-Controller-0004.",
    });
  }
};

const deleteUserGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await db.transaction();
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 4, 7);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const userGroup = await ModelUsersGroup.update(
      { estado: false },
      {
        where: {
          id,
          estado: true,
        },
        transaction,
      }
    );

    if (userGroup[0] === 0) {
      return res.status(500).json({
        estado: false,
        msg: "No se pudo eliminar el grupo de usuario.",
      });
    }

    await transaction.commit();

    return res.json({
      msg: "El grupo de usuario se elimino con éxito",
      estado: true,
      userGroup,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Users-Group-Controller-0005.",
    });
  }
};

export default {
  getUserGroup,
  getUsersGroups,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
};
