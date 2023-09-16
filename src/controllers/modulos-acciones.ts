import { Request, Response } from "express";
import { ModelModulesActions, ModelActions, ModelModule } from "../models";
import helpers from "../helpers";
import db from "../db/connection";
import {
  DataActualizarModulosAcciones,
  DataCrearModulosAcciones,
  ModulosAcciones,
} from "../interface/Modulos-Acciones";
const { validarPermisos } = helpers;

const getActionModule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 6);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const modulesActions = await ModelModulesActions.findOne({
      where: { id, estado: true },
      include: [
        {
          model: ModelActions,
          as: "acciones",
          attributes: ["nombre", "id"],
          where: { estado: true },
        },
        {
          model: ModelModule,
          as: "modulos",
          attributes: ["nombre", "id"],
          where: { estado: true },
        },
      ],
    });

    if (!modulesActions) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra el modulos-acciones." });
    }

    return res.json({ estado: true, modulesActions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Action-Module-Controller-0001.",
    });
  }
};

const getActionsModules = async (req: Request, res: Response) => {
  const { id_modulos } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 6);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const modulesActions = await ModelModulesActions.findAll({
      where: { id_modulos: id_modulos, estado: true },
      order: [["id", "ASC"]],
      include: [
        {
          model: ModelActions,
          as: "acciones",
          attributes: ["nombre", "id"],
          where: { estado: true },
        },
        {
          model: ModelModule,
          as: "modulos",
          attributes: ["nombre", "id"],
          where: { estado: true },
        },
      ],
    });

    if (modulesActions.length === 0) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra los modulos-acciones." });
    }

    return res.json({ estado: true, modulesActions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Action-Module-Controller-0002.",
    });
  }
};

const getActionsModulesByModules = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 6);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const modulesActions = await ModelModulesActions.findAll({
      where: { ...where, estado: true },
      order: [["id", "DESC"]],
      include: [
        {
          model: ModelModule,
          as: "modulos",
          attributes: ["nombre", "id"],
          where: { estado: true },
        },
      ],
    });

    if (modulesActions.length === 0) {
      return res
        .status(401)
        .json({ estado: false, msg: "No se encuentra los modulos-acciones." });
    }

    return res.json({ estado: true, modulesActions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Comuníquese con el administrador Error: Action-Module-Controller-0003.",
    });
  }
};

const createActionsModules = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { id_acciones, id_modulos, decoded }: DataCrearModulosAcciones =
    req.body;
  try {
    const validate = await validarPermisos(decoded, 2, 6);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const currentModuleActions: ModulosAcciones[] =
      await ModelModulesActions.findAll({
        where: { id_modulos, estado: true },
      }).then((data) => JSON.parse(JSON.stringify(data)));

    const idCurrentModuleActions = currentModuleActions.map((item) => {
      if (item.id_acciones) {
        return item.id_acciones;
      }
    });

    const deletedActions = currentModuleActions.filter(
      (item) => !id_acciones.includes(item.id_acciones)
    );

    const createdActions = id_acciones.filter(
      (item) => !idCurrentModuleActions.includes(item)
    );

    const createdActionsModules = await Promise.all(
      createdActions.map(
        async (item) =>
          await ModelModulesActions.create(
            {
              id_acciones: item,
              id_modulos: id_modulos,
            },
            {
              transaction,
            }
          )
      )
    );

    const deletedActionsModules = await Promise.all(
      deletedActions.map(
        async (item) =>
          await ModelModulesActions.update(
            { estado: false },
            {
              where: {
                id_acciones: item.id_acciones,
                id_modulos: id_modulos,
              },
              transaction,
            }
          )
      )
    );

    await transaction.commit();

    res.status(201).json({
      estado: true,
      createdActionsModules,
      deletedActionsModules,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Action-Module-Controller-0004.",
    });
  }
};

const updateActionsModules = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { id: moduleAccionId } = req.params;
  const { id_acciones, id_modulos, decoded }: DataActualizarModulosAcciones =
    req.body;
  try {
    const validate = await validarPermisos(decoded, 3, 6);
    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }
    const updatedModuleAccion = await ModelModulesActions.update(
      { id_modulos },
      {
        transaction,
        where: {
          id_modulos: moduleAccionId,
        },
      }
    );

    const currentModuleActions: ModulosAcciones[] =
      await ModelModulesActions.findAll({
        where: { id_modulos: moduleAccionId, estado: 1 },
      }).then((data) => JSON.parse(JSON.stringify(data)));

    const idCurrentModuleActions = currentModuleActions.map((item) => {
      if (item.id_acciones) return item.id_acciones;
    });

    const deletedActions = currentModuleActions.filter(
      (item) => !id_acciones.includes(item.id_acciones)
    );

    const createdActions = id_acciones.filter(
      (item) => !idCurrentModuleActions.includes(item)
    );

    const createdActionsModule = await Promise.all(
      createdActions.map(
        async (item) =>
          await ModelModulesActions.create(
            {
              id_modulos,
              id_acciones: item,
            },
            {
              transaction,
            }
          )
      )
    );

    const deletedActionsModule = await Promise.all(
      deletedActions.map(
        async (item) =>
          await ModelModulesActions.update(
            { estado: false },
            {
              where: {
                id_acciones: item.id_acciones,
                id_modulos: moduleAccionId,
              },
              transaction,
            }
          )
      )
    );

    await transaction.commit();

    return res.status(201).json({
      estado: true,
      updatedModuleAccion,
      createdActionsModule,
      deletedActionsModule,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Action-Module-Controller-0005.",
    });
  }
};

const deleteActionModule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await db.transaction();
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 4, 6);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const deleteModulesActions = await ModelModulesActions.update(
      { estado: false },
      { where: { id_modulos: id }, transaction }
    );

    if (!deleteModulesActions) {
      return res
        .status(500)
        .json({ estado: false, msg: "No se pudo eliminar el modulo-accion." });
    }

    await transaction.commit();

    return res.json({
      msg: "El modulo-accion se elimino con éxito",
      estado: true,
      deleteModulesActions,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Action-Module-Controller-0006.",
    });
  }
};

export default {
  getActionModule,
  getActionsModules,
  getActionsModulesByModules,
  createActionsModules,
  updateActionsModules,
  deleteActionModule,
};
