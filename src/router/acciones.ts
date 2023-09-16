import { Router } from "express";
import { check } from "express-validator";
import middlewares from "../middlewares/";
import { ActionsController } from "../controllers";

const { validarJWT, validarCampos } = middlewares;
const { getAction, getActions } = ActionsController;
const router = Router();

router.get("/", [validarJWT], getActions);

router.get(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  getAction
);

module.exports = router;
