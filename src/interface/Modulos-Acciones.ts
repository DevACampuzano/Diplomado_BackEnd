import { Decoded } from "./Validadores";
export interface ModulosAcciones {
  id?: number;
  id_acciones: number;
  id_modulos: number;
  estado: boolean;
}

export interface DataCrearModulosAcciones {
  decoded: Decoded;
  id_modulos: number;
  id_acciones: number[];
}

export interface DataActualizarModulosAcciones {
  decoded: Decoded;
  id_modulos: number;
  id_acciones: number[];
}
