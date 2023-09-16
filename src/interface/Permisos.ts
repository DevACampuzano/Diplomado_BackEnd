import { DataGrupoUsuarios } from "./Grupo-Usuarios";
import { ModulosAcciones } from "./Modulos-Acciones";
import { Decoded } from "./Validadores";

export interface DataPermisos {
  id?: number;
  id_grupos_usuarios: number;
  id_modulos_acciones: number;
  modulosAcciones: ModulosAcciones;
  grupoUsuarios?: DataGrupoUsuarios;
}

export interface DataCrearPermisos {
  decoded: Decoded;
  id_modulos: number;
  id_grupos_usuarios: number;
  id_acciones: number[];
}

export interface DataActualizarPermisos {
  decoded: Decoded;
  id_grupos_usuarios?: number;
  id_modulos_acciones?: number;
}
