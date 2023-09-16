import { DataTypes } from "sequelize";
import db from "../db/connection";

const GrupoUsuarios = db.define(
  "GrupoUsuarios",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "grupo_usuarios",
    timestamps: false,
  }
);

export default GrupoUsuarios;
