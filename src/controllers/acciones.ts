import { Request, Response } from "express";
import { ModelActions } from "../models";
import helpers from "../helpers";

const { validarPermisos } = helpers;

const getAction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 5);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const action = await ModelActions.findOne({
      where: { id, estado: true },
    });

    if (!action) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra la acción registrado." });
    }

    return res.json({ estado: true, action });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Log-Controller-0001.",
    });
  }
};

const getActions = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 5);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const actions = await ModelActions.findAll({
      where: { ...where, estado: true },
      order: [["nombre", "ASC"]],
    });

    if (actions.length === 0) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra las acciones." });
    }

    return res.json({ estado: true, actions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Log-Controller-0002.",
    });
  }
};

export default {
  getAction,
  getActions,
};
