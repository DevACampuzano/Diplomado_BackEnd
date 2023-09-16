import { Request, Response } from "express";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  DataCrearUsuario,
  DataActualizarUsuario,
  ParametrosGetUsers,
} from "../interface/Usuarios";
import SessionController from "./sesiones";
import {
  ModelActions,
  ModelModule,
  ModelModulesActions,
  ModelPermissions,
  ModelUser,
  ModelUsersGroup,
} from "../models/";
import db from "../db/connection";
import helpers from "../helpers/";
import Config from "../config";
import { FilesController } from "../utils";
import Email from "../utils/Email";
import { ResultGetFile } from "../utils/Files";
import { UploadedFile } from "express-fileupload";

const { salveFile, getFile } = FilesController;
const { validarPermisos, existUser } = helpers;

const getUsers = async <T extends Object>(req: Request, res: Response) => {
  const { where, decoded }: ParametrosGetUsers<T> = req.body;
  try {
    const validate = await validarPermisos(decoded, 1, 1);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const usuarios = await ModelUser.findAll({
      where: {
        ...where,
        estado: true,
        id: {
          [Op.ne]: decoded.id,
        },
      },
      order: [["id", "DESC"]],
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
    }).then((user) => JSON.parse(JSON.stringify(user)));

    if (usuarios.length === 0) {
      return res.status(404).json({
        estado: false,
        msg: "No se encontraron usuarios registrados.",
      });
    }

    await Promise.all(
      usuarios.map(async (user: { foto: string | ResultGetFile }) => {
        if (user.foto) {
          user.foto = await getFile(user.foto as string);
        }
        return user;
      })
    );

    res.json({ estado: true, usuarios });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0001.",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  try {
    if (id !== decoded.id) {
      const validate = await validarPermisos(decoded, 3, 1);

      if (!validate.estado) {
        const { estado, code, msg } = validate;
        return res.status(code).json({ estado, msg });
      }
    }

    const usuario = await ModelUser.findOne({
      where: { id, estado: true },
      order: [["id", "DESC"]],
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
    }).then((user) => JSON.parse(JSON.stringify(user)));

    if (!usuario) {
      return res
        .status(404)
        .json({ estado: false, msg: "No se encontró los datos del usuario." });
    }
    if (usuario.foto) {
      usuario.foto = await getFile(usuario.foto);
    }
    return res.json({ estado: true, usuario });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0002.",
    });
  }
};

const registerUser = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const {
    apellidos,
    direccion,
    email,
    id_tipo_documento,
    nombres,
    numero_identificacion,
    numero_telefono,
    password,
  }: DataCrearUsuario = req.body;

  try {
    let foto: UploadedFile | UploadedFile[] | undefined;
    if (req.files) {
      foto = req.files.foto;
    } else {
      foto = undefined;
    }
    const validateExist = await existUser(
      email,
      id_tipo_documento,
      numero_identificacion,
      true
    );

    if (validateExist.estado) {
      const { estado, code, msg } = validateExist;
      return res.status(code).json({ estado, msg });
    }

    const newPassword = await bcrypt.hash(password, 10);
    const data = {
      apellidos,
      direccion,
      email,
      id_tipo_documento,
      nombres,
      numero_identificacion,
      numero_telefono,
      password: newPassword,
      id_grupos_usuarios: 2,
    };

    const usuario = await ModelUser.create(data, { transaction }).then((user) =>
      JSON.parse(JSON.stringify(user))
    );

    if (foto) {
      const newPhoto =
        "profile/" +
        (await salveFile(foto as UploadedFile, "profile", usuario.id, "image"));

      await ModelUser.update(
        { foto: newPhoto },
        { where: { id: usuario.id, estado: true }, transaction }
      );
    }

    await transaction.commit();

    return res.status(201).json({ estado: true, usuario });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0003.",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    decoded,
    apellidos,
    direccion,
    email,
    id_tipo_documento,
    nombres,
    numero_identificacion,
    numero_telefono,
    password,
  }: DataActualizarUsuario = req.body;
  const { foto } = req?.files || { foto: undefined };

  const transaction = await db.transaction();
  try {
    if (id !== decoded.id) {
      const validate = await validarPermisos(decoded, 3, 1);

      if (!validate.estado) {
        const { estado, code, msg } = validate;
        return res.status(code).json({ estado, msg });
      }
    }

    if (email || id_tipo_documento || numero_identificacion) {
      const validateData = await existUser(
        email,
        id_tipo_documento,
        numero_identificacion,
        true
      );
      if (!validateData.estado) {
        const { estado, code, msg } = validateData;
        return res.status(code).json({ estado, msg });
      }
    }

    let newPassword;
    if (password) {
      newPassword = await bcrypt.hash(password, 10);
    } else {
      newPassword = password;
    }

    let newPhoto;
    if (foto) {
      newPhoto = await salveFile(foto as UploadedFile, "profile", id, "image");
      newPhoto = "profile/" + newPhoto;
    }
    const data = {
      apellidos,
      direccion,
      email,
      id_tipo_documento,
      nombres,
      numero_identificacion,
      numero_telefono,
      password: newPassword,
      foto: newPhoto,
    };

    const updateUser = await ModelUser.update(data, {
      where: { id, estado: true },
      transaction,
    });

    if (!updateUser) {
      return res
        .status(500)
        .json({ estado: false, msg: "No se pudo actualizar el usuario." });
    }

    await transaction.commit();

    return res.json({
      msg: "El usuario se actualizo con éxito",
      estado: true,
      updateUser,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0004.",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decoded } = req.body;
  const transaction = await db.transaction();
  try {
    if (id !== decoded.id) {
      const validate = await validarPermisos(decoded, 4, 1);

      if (!validate.estado) {
        const { estado, code, msg } = validate;
        return res.status(code).json({ estado, msg });
      }
    }

    const deleteUser = await ModelUser.update(
      { estado: false },
      { where: { id }, transaction }
    );

    if (deleteUser[0] === 0) {
      return res
        .status(500)
        .json({ estado: false, msg: "No se pudo eliminar el usuario." });
    }

    await transaction.commit();

    return res.json({
      msg: "El usuario se elimino con éxito",
      estado: true,
      deleteUser,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0005.",
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  try {
    const { email, password } = req.body;

    const user = await ModelUser.findOne({
      where: { estado: true, email },
    }).then((user) => JSON.parse(JSON.stringify(user)));
    if (!user) {
      return res.status(401).json({
        estado: false,
        msg: "El email ingresado no se encuentra registrado.",
      });
    }

    const { password: pass, id, id_grupos_usuarios } = user;

    const validatePassword = await bcrypt.compare(password, pass);
    if (!validatePassword) {
      return res
        .status(400)
        .json({ estado: false, msg: "Contraseña incorrecta." });
    }

    const token = jwt.sign({ id }, Config.secret, { expiresIn: "1d" });

    const createSesion = await SessionController.createSessions({
      transaction,
      id_usuarios: id,
      token_sesion: token,
    });

    if (!createSesion) {
      return res.status(400).json({
        estado: false,
        msg: "Ocurrió un problema al crear la sesion.",
      });
    }

    delete user.password;

    const permisos = await ModelPermissions.findAll({
      where: { estado: true, id_grupos_usuarios },
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

    await transaction.commit();

    return res.status(201).json({
      estado: true,
      data: {
        user,
        token,
        permisos,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0006.",
    });
  }
};

const recoverAccount = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await ModelUser.findOne({
      where: {
        estado: true,
        email,
      },
      attributes: {
        exclude: ["password"],
      },
    }).then((user) => JSON.parse(JSON.stringify(user)));
    if (user) {
      const result = await Email.enviarEmailPersonalizado(
        "Recuperar Contraseña",
        [user.email],
        "../../assets/emails/recoverEmail.html",
        {
          verificationLink: `${Config.urlFront}/account/forget/`,
        }
      );
      console.log(result);
    } else {
      return res.status(401).json({
        estado: false,
        msg: "no se encontró el usuario.",
      });
    }
    return res.json({
      estado: true,
      msg: "Se envió el correo de recuperación a su email.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0007.",
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { id } = req.params;
  const { password, decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 3, 1);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    const user = await ModelUser.findOne({ where: { estado: true, id } });

    const { password: pass } = JSON.parse(JSON.stringify(user));

    if (await bcrypt.compare(password, pass)) {
      return res.status(400).json({
        estado: false,
        msg: "La nueva contraseña no puede ser iguala a la anterior",
      });
    }

    const passwordCrypt = await bcrypt.hash(password, 10);
    await ModelUser.update(
      {
        password: passwordCrypt,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return res.json({
      estado: true,
      msg: "Contraseña actualizado con éxito.",
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0009.",
    });
  }
};

const changeGroupUser = async (req: Request, res: Response) => {
  const transaction = await db.transaction();
  const { id } = req.params;
  const { id_grupos_usuarios, decoded } = req.body;
  try {
    const validate = await validarPermisos(decoded, 3, 1);

    if (!validate.estado) {
      const { estado, code, msg } = validate;
      return res.status(code).json({ estado, msg });
    }

    await ModelUser.update(
      {
        id_grupos_usuarios,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return res.json({
      estado: true,
      msg: "Se actualizo el perfil del usuario con éxito.",
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).json({
      estado: false,
      msg: "Comuníquese con el administrador Error: UserController-0010.",
    });
  }
};

export default {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  signIn,
  recoverAccount,
  changePassword,
  changeGroupUser,
};
