import { DataTypes } from "sequelize";
import db from "../db/connection";

const Libros = db.define(
  "Libros",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disponibilidad: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Libros",
    timestamps: false,
  }
);

export default Libros;
