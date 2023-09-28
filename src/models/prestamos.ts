import { DataTypes } from "sequelize";
import db from "../db/connection";
import Usuarios from "./usuario";
import Libros from "./libros";


const Prestamos = db.define(
  "Prestamos",
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
    fecha_devolucion:{
      type: DataTypes.DATE,
      allowNull:true,
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Prestamos",
    createdAt: true,
    updatedAt:false,
  }
);

Usuarios.hasMany(Prestamos, {
  foreignKey: "id_usuario",
  as: "Prestamos",
});

Prestamos.belongsTo(Usuarios, {
  foreignKey: "id_usuario",
  as: "Usuario",
});

Libros.hasMany(Prestamos, {
  foreignKey: "id_libro",
  as: "Prestamos",
});

Prestamos.belongsTo(Libros, {
  foreignKey: "id_libro",
  as: "Libros",
});

export default Prestamos;
