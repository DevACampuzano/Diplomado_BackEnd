import { Request, Response } from "express";
import { ModelParameters } from "../models";
import helpers from "../helpers";
import db from "../db/connection";
import {
  DataCrearParametro,
  DataParametros,
} from "../interface/Parametros";

const { validarPermisos } = helpers;

const getParameter = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const { decoded } = req.body;
  try {
    /* 
    const validate = await validarPermisos(decoded, 1, 9);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    */
    const parameter = await ModelParameters.findOne({
      where: { id, estado: true },
    });

    if (!parameter) {
      return res.status(401).json({
        estado: false,
        msg: "No se encuentra el parámetro registrada.",
      });
    }

    return res.json({ estado: true, parameter });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Parameter-Controller-0001.",
    });
  }
};

const getParameters = async (req: Request, res: Response) => {
  const { /*decoded,*/ where } = req.body;
  try {
    /*const validate = await validarPermisos(decoded, 1, 9);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }*/

    const parameters = await ModelParameters.findAll({
      where: { ...where, estado: true },
      order: [["id", "DESC"]],
    });

    if (!parameters) {
      return res.status(401).json({
        estado: false,
        msg: "No se encontraron los parametros registrada.",
      });
    }
    return res.json({ estado: true, parameters });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Parameter-Controller-0002.",
    });
  }
};

const createParameter = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { nombre_parametro, valores_parametro, decoded }: DataCrearParametro =
    req.body;
  try {
    const validate = await validarPermisos(decoded, 2, 9);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const valores = JSON.stringify(valores_parametro, null, 3);

    const createdParameter: DataParametros = await ModelParameters.create(
      { nombre_parametro, valores },
      {
        transaction,
      }
    ).then((data) => JSON.parse(JSON.stringify(data)));

    await transaction.commit();
    return res.status(201).json({ estado: true, createdParameter });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Parameter-Controller-0003.",
    });
  }
};

const updatedParameter = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { id } = req.params;
  const { nombre_parametro, valores_parametro, decoded }: DataCrearParametro =
    req.body;
  try {
    const validate = await validarPermisos(decoded, 3, 9);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const valores= JSON.stringify(valores_parametro,null,3) ;
    const updatedParametro = await ModelParameters.update(
      { nombre_parametro,valores },
      { where: { id }, transaction }
    );

    await transaction.commit();
    return res.json({
      estado: true,
      updatedParametro,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Parameter-Controller-0004.",
    });
  }
};

const deleteParameter = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 4, 9);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const parameters = await ModelParameters.update(
      {
        estado: false,
      },
      {
        where: { id, estado: true },
        transaction,
      }
    );

    await transaction.commit();
    return res.json({ estado: true, parameters });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Parameter-Controller-0005.",
    });
  }
};

export default {
  getParameters,
  getParameter,
  createParameter,
  updatedParameter,
  deleteParameter,
};
