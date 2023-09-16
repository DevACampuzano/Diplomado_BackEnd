const notEmptyArray = async (array: [], msg: string) => {
  if (array.length === 0) {
    throw new Error(msg);
  }
};

/**
 * 
 Mínimo 8 caracteres
Máximo 15
Al menos una letra mayúscula
Al menos una letra minúscula
Al menos un dígito
No espacios en blanco
 */
const validatePasswordFormat = async (password: string) => {
  if (!password) {
    return;
  }

  const validate =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/.test(
      password
    );

  if (!validate) {
    throw new Error(
      `La contraseña no cumple con lo requisito de seguridad - ${[
        "Mínimo 8 caracteres",
        "Máximo 15 caracteres",
        "Al menos una letra mayúscula",
        "Al menos una letra minúscula",
        "Al menos un dígito",
        "No espacios en blanco",
      ]}`
    );
  }
};

export default { notEmptyArray, validatePasswordFormat };
