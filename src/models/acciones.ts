import { DataTypes } from "sequelize";
import db from "../db/connection";

const Acciones = db.define(
  "Acciones",
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
    tableName: "acciones",
    timestamps: false,
  }
);

export default Acciones;
