import { Request, Response } from "express";
import { ModelLog, ModelUser, ModelModule } from "../models";
import helpers from "../helpers";
import { DataCrearLog } from "../interface/Logs";

const { validarPermisos } = helpers;

const getLog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 4);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const log = await ModelLog.findOne({
      where: { id },
      include: [
        {
          model: ModelUser,
          as: "usuario",
          required: true,
        },
        {
          model: ModelModule,
          as: "modulo",
          required: true,
        },
      ],
    });

    if (!log) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra el log registrado." });
    }

    return res.json({ estado: true, log });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Log-Controller-0001.",
    });
  }
};

const getLogs = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 4);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const logs = await ModelLog.findAll({
      where,
      include: [
        {
          model: ModelUser,
          as: "usuario",
          required: true,
        },
        {
          model: ModelModule,
          as: "modulo",
          required: true,
        },
      ],
    });

    if (logs.length === 0) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra los logs." });
    }

    return res.json({ estado: true, logs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Log-Controller-0002.",
    });
  }
};

const createLogs = async ({
  id_modulos,
  id_usuarios,
  ip,
  registro,
  transaction,
}: DataCrearLog) => {
  const createdLog = await ModelLog.create(
    { id_modulos, id_usuarios, ip, registro },
    { transaction }
  );
  return createdLog;
};

export default {
  getLog,
  getLogs,
  createLogs,
};
