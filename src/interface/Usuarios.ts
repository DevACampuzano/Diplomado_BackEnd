import { Decoded } from "./Validadores";

export interface ParametrosGetUsers<T extends Object> {
  where?: T;
  decoded: Decoded;
}

export interface DataCrearUsuario {
  nombres: string;
  apellidos: string;
  numero_telefono?: string | string | null;
  email: string;
  password: string;
  direccion?: string | null;
  numero_identificacion: string;
  id_tipo_documento: string;
  id_grupos_usuarios: string;
}

export interface DataActualizarUsuario {
  decoded: Decoded;
  nombres: string;
  apellidos: string;
  numero_telefono?: string | string | null;
  email: string;
  password: string;
  direccion?: string | null;
  numero_identificacion: string;
  id_tipo_documento: string;
}
