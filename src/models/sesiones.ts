import { DataTypes } from "sequelize";
import db from "../db/connection";
import GrupoUsuariosModel from "./usuario";

const Sesiones = db.define(
  "Sesiones",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_sesion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    token_sesion: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    sesion_id: {
      type: DataTypes.STRING(500),
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    id_usuarios: {
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
    tableName: "sesiones",
    timestamps: false,
  }
);

Sesiones.belongsTo(GrupoUsuariosModel, {
  foreignKey: "id_usuarios",
  as: "usuario",
});

export default Sesiones;
