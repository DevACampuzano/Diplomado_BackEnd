import { Transaction } from "sequelize";

export interface DataCrearSesiones {
  token_sesion: string;
  id_usuarios: string | number;
  transaction: Transaction;
}
