import { DataTypes } from "sequelize";
import db from "../db/connection";
import GrupoUsuarios from "./grupo-usuarios";

const Usuarios = db.define(
  "Usuario",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numero_identificacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_tipo_documento: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_tipo_persona: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_grupos_usuarios: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: GrupoUsuarios,
        key: "id",
      },
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Usuario",
  }
);

GrupoUsuarios.hasMany(Usuarios, {
  foreignKey: "id_grupos_usuarios",
  as: "Usuarios",
});

Usuarios.belongsTo(GrupoUsuarios, {
  foreignKey: "id_grupos_usuarios",
  as: "grupoUsuarios",
});

export default Usuarios;
