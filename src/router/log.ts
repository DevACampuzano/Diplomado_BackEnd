import { Router } from "express";
import { check } from "express-validator";
import middlewares from "../middlewares/";
import { LogsController } from "../controllers";

const { validarJWT, validarCampos } = middlewares;
const { getLog, getLogs } = LogsController;

const router = Router();

router.get("/", [validarJWT], getLogs);

router.get(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  getLog
);

module.exports= router;
