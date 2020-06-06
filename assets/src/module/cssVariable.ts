namespace CSSVariable {
    export const getValue: (key: string) => string = (key: string): string => {
        const root: Element = <Element>document.querySelector(':root');
        const rootStyles: CSSStyleDeclaration = getComputedStyle(root);

        return rootStyles.getPropertyValue(key);
    };

    export const setValue: (key: string, val: string) => void = (
        key: string,
        val: string
    ): void => {
        document.documentElement.style.setProperty(key, val);
    };
}

export default CSSVariable;
