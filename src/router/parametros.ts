import { Router } from "express";
import { check } from "express-validator";
import middlewares from "../middlewares/";
import { ParametersController } from "../controllers";

const { validarJWT, validarCampos } = middlewares;
const {
  getParameters,
  getParameter,
  createParameter,
  updatedParameter,
  deleteParameter,
} = ParametersController;

const router = Router();

router.get("/", getParameters);

router.get(
  "/:id",
  [check("id", "El id es obligatorio").notEmpty(), validarCampos],
  getParameter
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre_parametro", "Los nombres son obligatorios").notEmpty(),
    check("valores", "Los valores debes ser una lista").isArray(),
    validarCampos,
  ],
  createParameter
);

router.put(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  updatedParameter
);

router.delete(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  deleteParameter
);

module.exports = router;
