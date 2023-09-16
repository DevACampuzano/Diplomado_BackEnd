import { Router } from "express";
import { check } from "express-validator";
import middlewares from "../middlewares/";
import { ModulesController } from "../controllers";

const { validarJWT, validarCampos } = middlewares;
const { getModules, getModule } = ModulesController;
const router = Router();

router.get("/", [validarJWT], getModules);

router.get(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  getModule
);

module.exports = router;
