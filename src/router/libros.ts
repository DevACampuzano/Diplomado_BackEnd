import { Router } from "express";
import { check } from "express-validator";
import middlewares from "../middlewares/";
import { BooksController } from "../controllers";
const { validarJWT, validarCampos } = middlewares;
const { getBook, getBooks, createBook, deleteBook, updateBook } =
  BooksController;
const router = Router();

router.get("/", [validarJWT], getBooks);

router.get(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  getBook
);

router.post(
  "/",
  [
    validarJWT,
    check("titulo", "El titulo es obligatorio").notEmpty(),
    check("autor", "El autor es obligatorio").notEmpty(),
    check("descripcion", "El descripción es obligatorio").notEmpty(),
    check("disponibilidad", "La disponibilidad es obligatorio").notEmpty(),
    validarCampos,
  ],
  createBook
);

router.put(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  updateBook
);

router.delete(
  "/:id",
  [validarJWT, check("id", "El id es obligatorio").notEmpty(), validarCampos],
  deleteBook
);

module.exports = router;
