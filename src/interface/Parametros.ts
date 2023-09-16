import { Decoded } from "./Validadores";

export interface DataParametros {
  id: number | string;
}

export interface DataValoresPanametros {
  id?: number | string;
  valor: number | string;
}

export interface DataCrearParametro {
  nombre_parametro: string;
  valores_parametro: DataValoresPanametros[];
  decoded: Decoded;
}
