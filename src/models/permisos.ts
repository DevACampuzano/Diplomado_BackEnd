import { DataTypes } from "sequelize";
import db from "../db/connection";
import GrupoUsuarios from "./grupo-usuarios";
import ModulosAcciones from "./modulo-acciones";

const Permisos = db.define(
  "Permisos",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_grupos_usuarios: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_modulos_acciones: {
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
    tableName: "permisos",
    timestamps: false,
  }
);

Permisos.belongsTo(GrupoUsuarios, {
  foreignKey: "id_grupos_usuarios",
  as: "grupoUsuarios",
});

Permisos.belongsTo(ModulosAcciones, {
  foreignKey: "id_modulos_acciones",
  as: "modulosAcciones",
});
export default Permisos;
