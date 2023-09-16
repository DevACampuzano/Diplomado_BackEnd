import { Router } from "express";
import { SessionsController } from "../controllers";
import middlewares from "../middlewares/";
import { check } from "express-validator";
const { getSessions, getSession, validateSessions } = SessionsController;
const { validarJWT, validarCampos } = middlewares;

const router = Router();

router.get("/", [validarJWT], getSessions);

router.get("/validar-sesion", [validarJWT], validateSessions);

router.get(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  getSession
);

module.exports = router;
