// import npmDebug = req
// export const Debug 
// import npmDebug from 'debug';

const npmDebug = (ctx: string) => (...args: any[]) => console.log(ctx, ...args);

export const Debug = {
  Npms: npmDebug('npms'),
  NpmsConnector: npmDebug('npms-connector'),
  Cms: npmDebug('cms'),
  CmsConnector: npmDebug('cms-connector'),
  StaticGeneration: npmDebug('static-generation'),
  ServerSideProps: npmDebug('server-side-props'),
  Api: npmDebug('api'),
  ApiConnector: npmDebug('api-connector'),
  ApiCredentials: npmDebug('api-credentials'),
} as const;
