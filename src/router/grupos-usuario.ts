import { Router } from "express";
import { check } from "express-validator";
import { UsersGroupsController } from "../controllers";
import middlewares from "../middlewares/";

const { validarJWT, validarCampos } = middlewares;
const {
  getUserGroup,
  getUsersGroups,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
} = UsersGroupsController;
const router = Router();

router.get("/", [validarJWT], getUsersGroups);

router.get(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  getUserGroup
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "Los nombres son obligatorios").notEmpty(),
    validarCampos,
  ],
  createUserGroup
);

router.put(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  updateUserGroup
);

router.delete(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  deleteUserGroup
);

module.exports = router;
