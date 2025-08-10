import * as react_jsx_runtime from 'react/jsx-runtime';

type Tilda = {
    css: string[];
    js: string[];
    promoBlockId: number;
    content: string;
};
type Props = {
    tilda: Tilda;
    className?: string;
    onError?: (_error: ErrorEvent) => void;
    onLoad?: () => void;
};
declare const TildaComponent: ({ tilda, className, onError, onLoad, }: Props) => react_jsx_runtime.JSX.Element;

export { Tilda, TildaComponent };
