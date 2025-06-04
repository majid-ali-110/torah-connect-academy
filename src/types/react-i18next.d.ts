
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

declare module 'react' {
  interface ReactElement {
    children?: ReactNode;
  }
}

// Override react-i18next's children type to be compatible with React's ReactNode
declare global {
  namespace React {
    type ReactI18NextChildren = ReactNode;
  }
}
