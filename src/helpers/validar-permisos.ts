import { Decoded, Validadores } from "../interface/Validadores";
import {
  ModelPermissions,
  ModelUser,
  ModelUsersGroup,
  ModelModulesActions,
} from "../models/";

const validarPermisos = async (
  decoded: Decoded,
  accion: number,
  modulo: number
): Promise<Validadores> => {
  const { id } = decoded;
  const user = await ModelUser.findOne({
    where: { estado: true, id },
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: ModelUsersGroup,
        as: "grupoUsuarios",
        where: { estado: true },
      },
    ],
  });
  if (!user) {
    return { estado: false, msg: "Usuario no habilitado.", code: 404 };
  }

  const jsonUser = JSON.parse(JSON.stringify(user));
  const permisos = await ModelPermissions.findOne({
    where: {
      estado: true,
      id_grupos_usuarios: jsonUser.grupoUsuarios.id,
    },
    include: [
      {
        required: true,
        model: ModelModulesActions,
        as: "modulosAcciones",
        where: {
          estado: true,
          id_acciones: accion,
          id_modulos: modulo,
        },
      },
    ],
  });

  if (!permisos) {
    return {
      estado: false,
      msg: "Usuario no tiene el permiso para realizar esta acción.",
      code: 401,
    };
  }

  return { estado: true, msg: "", code: 200 };
};

export default { validarPermisos };
