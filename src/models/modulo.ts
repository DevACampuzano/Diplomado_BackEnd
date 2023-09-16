import { DataTypes } from "sequelize";
import db from "../db/connection";

const Modulos = db.define(
  "Modulos",
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
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "modulos",
    timestamps: false,
  }
);

export default Modulos;
