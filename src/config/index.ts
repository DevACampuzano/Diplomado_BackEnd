//import path from "path";
import { config } from "dotenv";

//config({ path: path.resolve(__dirname, "../../.env") });

config();

const Config = {
  //config
  port: process.env.PORT,
  secret: process.env.AUTH_JWT_SECRET || "",
  dev: process.env.NODE_ENV !== "production",
  //DB
  hostDB: process.env.HOST_DB || "",
  userDB: process.env.USER_DB || "",
  portDB: process.env.PORT_DB || "",
  nameDB: process.env.NAME_DB || "",
  PasswordDB: process.env.PASSWORD_DB || "",
  //from
  urlFront: process.env.URL_FRONT,

  //Mails
  hostMail: process.env.HOST_MAIL,
  portMail: parseInt("process.env.PORT_MAIL") || 0,
  userMail: process.env.USER_MAIL,
  passwordMail: process.env.PASSWORD_MAIL,
  // keyMail: process.env.KEY_MAIL,

  //CERTIFICADOS
  urlCertificado: process.env.URL_CERTIFICADO,
};

export default Config;
