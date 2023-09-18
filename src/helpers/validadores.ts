import { Op } from "sequelize";
import { Validadores } from "../interface/Validadores";
import { ModelUser, ModelModule, ModelUsersGroup } from "../models";

const existUserPorID = async (id: number | string) => {
  if (id) {
    const user = await ModelUser.findOne({ where: { id, estado: true } });
    if (!user) {
      throw new Error("Usuario no se encuentra registrado o activo.");
    }
  }
};

const existUserPorEmail = async (email: string) => {
  if (email) {
    const user = await ModelUser.findOne({ where: { email, estado: true } });
    if (!user) {
      throw new Error("Usuario no se encuentra registrado o activo.");
    }
  }
};

const existModulePorID = async (id_modulos: number | string) => {
  if (id_modulos) {
    const module = await ModelModule.findOne({
      where: { id: id_modulos, estado: true },
    });
    if (!module) {
      throw new Error("Modulo no se encuentra registrado o activo.");
    }
  }
};

const existUserGroupPorID = async (id: number | string) => {
  if (id) {
    const module = await ModelUsersGroup.findOne({
      where: { id, estado: true },
    });
    if (!module) {
      throw new Error("Grupo de usuarios no se encuentra registrado o activo.");
    }
  }
};

const existUser = async (
  email?: string | null,
  // id_tipo_documento?: number | string | null,
  numero_identificacion?: string | null
  //or?: boolean | null
): Promise<Validadores> => {
  if (!email) {
    return {
      estado: false,
      msg: "Para esta búsqueda se requiere el email.",
      code: 400,
    };
  }

  // if (!id_tipo_documento) {
  //   return {
  //     estado: false,
  //     msg: "Para esta búsqueda se requiere el tipo de documento y el numero de documento.",
  //     code: 400,
  //   };
  // }

  if (!numero_identificacion) {
    return {
      estado: false,
      msg: "Para esta búsqueda se requiere el tipo de documento y el numero de documento.",
      code: 400,
    };
  }
  const user = await ModelUser.findOne({
    where: {
      estado: true,
      [Op.or]: [{ email }, { numero_identificacion }],
    },
  });

  if (!user) {
    return {
      estado: false,
      msg: "Usuario no se encuentra registrado o activo.",
      code: 401,
    };
  }

  return { estado: true, msg: "", code: 200 };
};

export default {
  existUserPorID,
  existUser,
  existModulePorID,
  existUserGroupPorID,
  existUserPorEmail,
};
