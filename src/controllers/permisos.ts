import { Request, Response } from "express";
import {
  ModelActions,
  ModelModule,
  ModelModulesActions,
  ModelPermissions,
  ModelUsersGroup,
} from "../models";
import helpers from "../helpers";
import db from "../db/connection";
import {
  DataActualizarPermisos,
  DataCrearPermisos,
  DataPermisos,
} from "../interface/Permisos";
import { ModulosAcciones } from "../interface/Modulos-Acciones";

const { validarPermisos } = helpers;

const getPermission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 8);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const permission = await ModelPermissions.findOne({
      where: { id, estado: true },
      include: [
        {
          model: ModelUsersGroup,
          as: "grupoUsuarios",
          where: { estado: true },
        },
        {
          model: ModelModulesActions,
          as: "modulosAcciones",
          where: { estado: true },
          include: [
            {
              model: ModelModule,
              as: "modulos",
              attributes: ["nombre", "id"],
            },
            {
              model: ModelActions,
              as: "acciones",
              attributes: ["nombre", "id"],
            },
          ],
        },
      ],
    });
    if (!permission) {
      return res.status(401).json({
        estado: false,
        msg: "No se encuentra el permiso registrada.",
      });
    }
    return res.json({ estado: true, permission });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Permission-Controller-0001.",
    });
  }
};

const getPermissions = async (req: Request, res: Response) => {
  const { decoded, where } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 8);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const permission = await ModelPermissions.findAll({
      where: { ...where, estado: true },
      include: [
        {
          model: ModelUsersGroup,
          as: "grupoUsuarios",
          where: { estado: true },
        },
        {
          model: ModelModulesActions,
          as: "modulosAcciones",
          where: { estado: true },
          include: [
            {
              model: ModelModule,
              as: "modulos",
              attributes: ["nombre", "id"],
            },
            {
              model: ModelActions,
              as: "acciones",
              attributes: ["nombre", "id"],
            },
          ],
        },
      ],
    });
    if (permission.length === 0) {
      return res.status(401).json({
        estado: false,
        msg: "No se encontraron los permisos registrada.",
      });
    }
    return res.json({ estado: true, permission });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Permission-Controller-0002.",
    });
  }
};

const getPermissionsByUserGroup = async (req: Request, res: Response) => {
  const { id_grupos_usuarios } = req.params;
  const { decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 8);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const permissions = await ModelPermissions.findAll({
      where: { id_grupos_usuarios, estado: true },
      order: [["id", "DESC"]],
      include: [
        {
          model: ModelUsersGroup,
          as: "grupoUsuarios",
          where: { estado: true },
        },
        {
          model: ModelModulesActions,
          as: "modulosAcciones",
          where: { estado: true },
          include: [
            {
              model: ModelModule,
              as: "modulos",
              attributes: ["nombre", "id"],
            },
            {
              model: ModelActions,
              as: "acciones",
              attributes: ["nombre", "id"],
            },
          ],
        },
      ],
    });
    if (permissions.length === 0) {
      return res.status(401).json({
        estado: false,
        msg: "No se encontraron los permisos registrada.",
      });
    }
    return res.json({ estado: true, permissions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Permission-Controller-0003.",
    });
  }
};

const createPermission = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const {
    decoded,
    id_acciones,
    id_grupos_usuarios,
    id_modulos,
  }: DataCrearPermisos = req.body;
  try {
    const validate = await validarPermisos(decoded, 2, 8);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const currentPermission: DataPermisos[] = await ModelPermissions.findAll({
      include: [
        {
          model: ModelModulesActions,
          as: "modulosAcciones",
          where: { id_modulos: id_modulos },
        },
      ],
      where: { estado: true, id_grupos_usuarios },
    }).then((data) => JSON.parse(JSON.stringify(data)));

    const currentModuleAccion: ModulosAcciones[] =
      await ModelModulesActions.findAll({
        where: { estado: true, id_modulos },
      }).then((data) => JSON.parse(JSON.stringify(data)));

    const DeletedPermission = currentPermission.filter(
      (item) => !id_acciones.includes(item.modulosAcciones.id_acciones)
    );

    const CreatedPermission = currentModuleAccion.filter((item) =>
      id_acciones.includes(item.id_acciones)
    );

    let deletedPermission;
    if (DeletedPermission.length > 0) {
      deletedPermission = await Promise.all(
        DeletedPermission.map(
          async (item) =>
            await ModelPermissions.update(
              { estado: false },
              {
                where: {
                  id: item.id,
                },
                transaction,
              }
            )
        )
      );
    }

    let createdPermission;
    if (CreatedPermission.length > 0) {
      createdPermission = await Promise.all(
        CreatedPermission.map(
          async (item) =>
            await ModelPermissions.create(
              {
                id_grupos_usuarios: id_grupos_usuarios,
                id_modulos_acciones: item.id,
              },
              {
                transaction,
              }
            )
        )
      );
    }

    await transaction.commit();
    return res
      .status(201)
      .json({ estado: true, createdPermission, deletedPermission });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Permission-Controller-0004.",
    });
  }
};

const updatePermission = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const {
    decoded,
    id_grupos_usuarios,
    id_modulos_acciones,
  }: DataActualizarPermisos = req.body;
  const { id } = req.params;
  try {
    const validate = await validarPermisos(decoded, 3, 8);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const updatedPermission = await ModelPermissions.update(
      { id_grupos_usuarios, id_modulos_acciones },
      {
        where: {
          id,
        },
        transaction,
      }
    );

    if (!updatedPermission) {
      return res.status(500).json({
        estado: false,
        msg: "No se pudo actualizar el permiso.",
      });
    }

    await transaction.commit();

    return res.status(200).json({ estado: true, updatedPermission });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Permission-Controller-0005.",
    });
  }
};

const deletePermission = async (req: Request, res: Response) => {
  const { id_grupos_usuarios } = req.params;
  const transaction = await db.transaction();
  const { decoded, id_modulos } = req.body;
  try {
    const validate = await validarPermisos(decoded, 4, 8);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const currentPermission: DataPermisos[] = await ModelPermissions.findAll({
      where: {
        id_grupos_usuarios,
        estado: true,
      },
      include: [
        {
          model: ModelModulesActions,
          as: "modulosAcciones",
          where: { id_modulos },
        },
      ],
    }).then((data) => JSON.parse(JSON.stringify(data)));

    const idActionsCurrentPermission = currentPermission.map((permission) => {
      if (permission.id) return permission.id;
    });

    const deletedPermissions = await Promise.all(
      idActionsCurrentPermission.map(
        async (item) =>
          await ModelPermissions.update(
            { estado: false },
            {
              where: { id: item },
              transaction,
            }
          )
      )
    );

    await transaction.commit();
    return res.status(201).json({ estado: true, deletedPermissions });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: Permission-Controller-0006.",
    });
  }
};

export default {
  getPermission,
  getPermissions,
  getPermissionsByUserGroup,
  createPermission,
  deletePermission,
  updatePermission,
};
