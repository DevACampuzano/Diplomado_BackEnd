import { Request, Response } from "express";
import { ModelUser, ModelSessions } from "../models";
import helpers from "../helpers";
import { DataCrearSesiones } from "../interface/Sesiones";

const { validarPermisos } = helpers;

const getSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 2);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const session = await ModelSessions.findOne({
      where: { estado: true, id },
      include: [
        {
          model: ModelUser,
          as: "usuario",
          where: { estado: true },
          required: true,
        },
      ],
    });
    if (!session) {
      return res
        .status(401)
        .json({ estatus: false, msg: "No se encuentra la sesion registrada." });
    }

    return res.json({ estatus: true, session });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: sessionController-0001.",
    });
  }
};

const getSessions = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 2);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const session = await ModelSessions.findAll({
      where: { ...where, estado: true },
      include: [
        {
          model: ModelUser,
          as: "usuario",
          where: { estado: true },
          required: true,
        },
      ],
    });

    if (session.length === 0) {
      return res
        .status(401)
        .json({ estatus: false, msg: "No se encuentra las sesiones." });
    }

    return res.json({ estatus: true, session });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: sessionController-0002.",
    });
  }
};

const createSessions = async ({
  token_sesion,
  id_usuarios,
  transaction,
}: DataCrearSesiones) => {
  const createdSession = await await ModelSessions.create(
    { token_sesion, id_usuarios },
    { transaction }
  );
  return createdSession;
};

const validateSessions = async (req: Request, res: Response) => {
  const token = req.headers["access-token"] || "";
  try {
    const session = await ModelSessions.findOne({
      where: { estado: true, token_sesion: token },
      include: [
        {
          model: ModelUser,
          as: "usuario",
          where: { estado: true },
          required: true,
        },
      ],
    });
    if (!session) {
      return res.status(401).json({ estado: false });
    }

    return res.json({ estado: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: sessionController-0003.",
    });
  }
};

export default {
  getSession,
  getSessions,
  createSessions,
  validateSessions,
};
