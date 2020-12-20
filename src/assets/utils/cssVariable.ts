const getValue: (key: string) => string = (key: string): string => {
  const root: Element = document.querySelector(':root') as Element;
  const rootStyles: CSSStyleDeclaration = getComputedStyle(root);

  return rootStyles.getPropertyValue(key);
};

const setValue: (key: string, val: string) => void = (
  key: string,
  val: string,
): void => {
  document.documentElement.style.setProperty(key, val);
};

export const CSSVariable = {
  getValue,
  setValue,
};
