export type TBinding = {
    name: string;
    value: string;
    oldValue: string | object;
    expression: string;
    arg: string;
    modifiers: object;
};

export interface IParsedColor {
    color: string;
    count: number;
}
