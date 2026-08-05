/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
