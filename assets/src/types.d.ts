declare module '*.json' {
  const value: string;
  export default value;
}
declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module 'react-perfect-scrollbar' {
  const PerfectScrollbar: any;
  export default PerfectScrollbar;
}
