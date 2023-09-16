import { DataTypes } from "sequelize";
import db from "../db/connection";

const Parametros = db.define(
  "Parametros",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_parametro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valores:{
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: '[{"id": "1", "valor": "Valor por defecto"}]'
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "parametros",
    timestamps: false,
  }
);

export default Parametros;
