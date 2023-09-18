import { Router } from "express";
import { UserController } from "../controllers";
import { check } from "express-validator";
import middlewares from "../middlewares/";
import helpers from "../helpers/";

const {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  signIn,
  recoverAccount,
  changePassword,
  changeGroupUser,
} = UserController;
const { validarJWT, validarCampos, validatePasswordFormat } = middlewares;
const { existUserPorID, existUserPorEmail } = helpers;
const router = Router();

router.get("/", [validarJWT, validarCampos], getUsers);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").notEmpty(),
    check("id").custom(existUserPorID),
    validarCampos,
  ],
  getUser
);

router.post(
  "/",
  [
    check("nombres", "Los nombres son obligatorios").notEmpty(),
    check("apellidos", "Los apellidos son obligatorios").notEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").notEmpty(),
    check("password").custom(validatePasswordFormat),
    check(
      "numero_identificacion",
      "El numero de identificacion es obligatoria"
    ).notEmpty(),
    validarCampos,
  ],
  registerUser
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").notEmpty(),
    check("id").custom(existUserPorID),
    check("password").custom(validatePasswordFormat),
    validarCampos,
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").notEmpty(),
    check("id").custom(existUserPorID),
    validarCampos,
  ],
  deleteUser
);

router.post(
  "/signin",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").notEmpty(),
    validarCampos,
  ],
  signIn
);

router.post(
  "/recover-account",
  [
    check("email", "El correo es obligatorio").notEmpty(),
    check("email", "El correo debe ser un correo valido").isEmail(),
    check("email").custom(existUserPorEmail),
    validarCampos,
  ],
  recoverAccount
);

router.put(
  "/change-password/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").notEmpty(),
    check("id").custom(existUserPorID),
    check("password", "La contraseña es obligatoria").notEmpty(),
    check("password").custom(validatePasswordFormat),
    validarCampos,
  ],
  changePassword
);

router.put(
  "/change-group-user/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").notEmpty(),
    check("id").custom(existUserPorID),
    check(
      "id_grupos_usuarios",
      "El grupo de usuario es obligatorio"
    ).notEmpty(),
    validarCampos,
  ],
  changeGroupUser
);

module.exports =router;
