import { Router } from "express";
import { check } from "express-validator";
import middlewares from "../middlewares/";
import helpers from "../helpers";
import { ModulesActionsController } from "../controllers";

const { validarJWT, validarCampos, notEmptyArray } = middlewares;
const { existModulePorID } = helpers;
const {
  getActionModule,
  getActionsModules,
  getActionsModulesByModules,
  createActionsModules,
  updateActionsModules,
  deleteActionModule,
} = ModulesActionsController;

const router = Router();

router.get("/", [validarJWT], getActionsModules);

router.get(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio.").notEmpty(), validarCampos],
  getActionModule
);

router.get(
  "/get-actions-modules-by-modules/:id_modulos",
  [
    validarJWT,
    check("id_modulos", "El id_modulos es obligatorio.").notEmpty(),
    check("id_modulos").custom(existModulePorID),
    validarCampos,
  ],
  getActionsModulesByModules
);

router.post(
  "/",
  [
    validarJWT,
    check("id_acciones").custom((id) =>
      notEmptyArray(id, "La accion es obligatoria.")
    ),
    check("id_acciones", "Debe ser una lista.").isArray(),
    check("id_modulos", "El modulo es obligatoria.").notEmpty(),
    validarCampos,
  ],
  createActionsModules
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").notEmpty(),
    check("id_acciones").custom((id) =>
      notEmptyArray(id, "La accion es obligatoria.")
    ),
    check("id_acciones", "Debe ser una lista.").isArray(),
    check("id_modulos", "El modulo es obligatoria.").notEmpty(),
    validarCampos,
  ],
  updateActionsModules
);

router.delete(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  deleteActionModule
);

module.exports = router;
