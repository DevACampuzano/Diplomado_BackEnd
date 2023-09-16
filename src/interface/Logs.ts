import { Transaction } from "sequelize";

export interface DataCrearLog {
  id_usuarios: number | string;
  id_modulos: number | string;
  registro: string;
  ip: string;
  transaction?: Transaction;
}
