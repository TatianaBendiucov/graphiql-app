export interface SchemaResponse {
  data: {
    __schema: {
      [key: string]: Record<string, unknown>;
    };
  };
}
