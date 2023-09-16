import { Request, Response } from "express";
import { ModelModule } from "../models";
import helpers from "../helpers";

const { validarPermisos } = helpers;

const getModule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 3);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const modulo = await ModelModule.findOne({
      where: { estado: true, id },
    });

    if (!modulo) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra el modulo registrado." });
    }

    return res.json({ estado: true, modulo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Module-Controller-0001.",
    });
  }
};

const getModules = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 3);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const modules = await ModelModule.findAll({
      where: { ...where, estado: true },
      order: [["nombre", "ASC"]],
    });

    if (modules.length === 0) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra los modulos." });
    }

    return res.json({ estado: true, modules });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Module-Controller-0002.",
    });
  }
};

export default {
  getModule,
  getModules,
};
