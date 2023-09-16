import validarJWT from "./validar-jwt";
import validarCampos from "./validar-campos";
import validarCustom from "./validadores-custom";

export default {
  ...validarJWT,
  ...validarCampos,
  ...validarCustom,
};
