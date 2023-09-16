import { DataTypes } from "sequelize";
import db from "../db/connection";
import Acciones from "./acciones";
import Modulos from "./modulo";

const ModulosAcciones = db.define(
  "ModulosAcciones",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_acciones: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_modulos: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.TINYINT,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "modulos_acciones",
    timestamps: false,
  }
);

ModulosAcciones.belongsTo(Acciones, {
  foreignKey: "id_acciones",
  as: "acciones",
});

ModulosAcciones.belongsTo(Modulos, {
  foreignKey: "id_modulos",
  as: "modulos",
});

export default ModulosAcciones;
