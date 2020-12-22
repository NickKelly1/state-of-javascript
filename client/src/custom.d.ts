
// declare module '*.graphql' {
//   declare const content: string;
//   export default content;
// }

// import { ReactNode } from "react";

// declare module 'react-json-view' {
//   interface JsonViewer { src: (json: any) => ReactNode };
//   export default JsonViewer;
// }

// declare module 'remark-highlight.js' {
//   // todo: type this proper...
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   declare const stuff: any;
//   export default stuff;
// }

declare module 'remark-prism' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare const any: any;
  export default any;
}