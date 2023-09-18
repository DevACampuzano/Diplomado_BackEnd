import { DataTypes } from "sequelize";
import db from "../db/connection";
import Usuarios from "./usuario";
import Libros from "./libros";


const Pretamos = db.define(
  "Pretamos",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_libro: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_usuario: {
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
    tableName: "Pretamos",
    timestamps: false,
  }
);

Usuarios.hasMany(Pretamos, {
  foreignKey: "id_usuario",
  as: "Prestamos",
});

Pretamos.belongsTo(Usuarios, {
  foreignKey: "id_usuario",
  as: "Usuario",
});

Libros.hasMany(Pretamos, {
  foreignKey: "id_libro",
  as: "Prestamos",
});

Pretamos.belongsTo(Libros, {
  foreignKey: "id_libro",
  as: "Libros",
});

export default Pretamos;
