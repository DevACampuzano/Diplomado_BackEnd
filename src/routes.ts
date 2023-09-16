interface IApiPaths {
  url: string;
  router: string;
}

export const ApiPaths: IApiPaths[] = [
  { url: "/log", router: "log" },
  { url: "/modulos", router: "modulos" },
  { url: "/usuarios", router: "usuarios" },
  { url: "/sesiones", router: "sesiones" },
  { url: "/permisos", router: "permisos" },
  { url: "/acciones", router: "acciones" },
  { url: "/parametros", router: "parametros" },
  { url: "/grupos-usuarios", router: "grupos-usuario" },
  { url: "/modulos-acciones", router: "modulos-acciones" },
];
