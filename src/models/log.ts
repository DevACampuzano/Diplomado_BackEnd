import { DataTypes } from "sequelize";
import db from "../db/connection";
import Modulos from "./modulo";
import Usuarios from "./usuario";

const Log = db.define(
  "Log",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    registro: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_usuarios: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Usuarios,
        key: "id",
      },
    },
    id_modulos: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Modulos,
        key: "id",
      },
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: db.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "Log",
    timestamps: false,
  }
);

Log.belongsTo(Usuarios, {
  foreignKey: "id_usuarios",
  as: "usuario",
});

Log.belongsTo(Modulos, {
  foreignKey: "id_modulos",
  as: "modulo",
});

export default Log;
