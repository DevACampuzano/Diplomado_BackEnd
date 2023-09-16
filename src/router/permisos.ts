import { Router } from "express";
import { check } from "express-validator";
import middlewares from "../middlewares/";
import helpers from "../helpers";
import { PermissionsController } from "../controllers";

const { existUserGroupPorID, existModulePorID } = helpers;
const { validarJWT, validarCampos } = middlewares;
const {
  getPermission,
  getPermissions,
  getPermissionsByUserGroup,
  deletePermission,
  createPermission,
  updatePermission,
} = PermissionsController;
const router = Router();

router.get("/", [validarJWT], getPermissions);

router.get(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  getPermission
);

router.get(
  "/get-permissions-by-usergroup/:id_grupos_usuarios",
  [
    validarJWT,
    check(
      "id_grupos_usuarios",
      "El id_grupos_usuarios es obligatorio"
    ).notEmpty(),
    check("id_grupos_usuarios").custom(existUserGroupPorID),
    validarCampos,
  ],
  getPermissionsByUserGroup
);

router.post(
  "/",
  [
    validarJWT,
    check("id_acciones", "El id_acciones son obligatorios").notEmpty(),
    check(
      "id_grupos_usuarios",
      "El id_grupos_usuarios son obligatorios"
    ).notEmpty(),
    check("id_grupos_usuarios").custom(existUserGroupPorID),
    check("id_modulos", "El id_modulos son obligatorios").notEmpty(),
    check("id_modulos").custom(existModulePorID),
    validarCampos,
  ],
  createPermission
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").notEmpty(),
    check(
      "id_grupos_usuarios",
      "El id_grupos_usuarios es obligatorio"
    ).notEmpty(),
    check(
      "id_modulos_acciones",
      "El id_modulos_acciones es obligatorio"
    ).notEmpty(),
    check("id_grupos_usuarios").custom(existUserGroupPorID),
    validarCampos,
  ],
  updatePermission
);

router.delete(
  "/:id_grupos_usuarios",
  [
    validarJWT,
    check(
      "id_grupos_usuarios",
      "El id_grupos_usuarios es obligatorio"
    ).notEmpty(),
    check("id_grupos_usuarios").custom(existUserGroupPorID),
    check("id_modulos", "El id_modulos es obligatorio").notEmpty(),
    check("id_modulos").custom(existModulePorID),
    validarCampos,
  ],
  deletePermission
);

module.exports =router;
