declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module 'react-native-vector-icons/*';

declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-svg' {
  export * from 'react-native-svg/lib/typescript/index';
}

declare module '@fortawesome/react-native-fontawesome' {
  import { ComponentType } from 'react';
  import { SvgProps } from 'react-native-svg';
  
  export interface FontAwesomeIconProps extends SvgProps {
    icon: any;
    size?: number;
    color?: string;
  }
  
  export const FontAwesomeIcon: ComponentType<FontAwesomeIconProps>;
}

declare module '@fortawesome/free-solid-svg-icons' {
  export const faMugSaucer: any;
  // Add other icons as needed
}

declare module '@fortawesome/fontawesome-svg-core' {
  export const library: {
    add: (...icons: any[]) => void;
  };
}