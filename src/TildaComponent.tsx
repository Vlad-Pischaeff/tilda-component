import { useEffect, useRef } from "react";
import styles from "./TildaComponent.module.scss";

export type Tilda = {
  css: string[];
  js: string[];
  promoBlockId: number;
  content: string;
};

type BlobProps = {
  cssArr: string[];
  jsArr: string[];
  id: number;
};

type IframeElement = HTMLIFrameElement & {
  initHTML?: () => string;
};

type Props = {
  tilda: Tilda;
  className?: string;
  onError?: () => void;
};

export const TildaComponent = ({ tilda, className, onError }: Props) => {
  const ref = useRef<IframeElement>(null);

  const getGeneratedPageURL = ({ cssArr, jsArr, id }: BlobProps) => {
    const getBlobURL = (code: string, type: string) => {
      const blob = new Blob([code], { type });
      return URL.createObjectURL(blob);
    };

    const getCSS = (cssArray: string[]) =>
      cssArray
        .map(css => `<link rel="stylesheet" type="text/css" href="${css}" />`)
        .join(' ');

    const getJS = (jsArray: string[]) =>
      jsArray
        .map(js => `<script src="${js}" blocking="render"></script>`)
        .join(' ');

    const source = `
      <html>
        <head>
          ${getCSS(cssArr)}
          ${getJS(jsArr)}
        </head>
        <body style="overflow: hidden">
          <div id="tilda">tilda body content</div>
          <script>
            const EL = document.getElementById('tilda');
            const IFRAME = window.parent.document.getElementById('iframe${id}');
            const setHTML = (html) => {
              const range = document.createRange();
              range.selectNode(EL);
              const documentFragment = range.createContextualFragment(html);
              EL.innerHTML = '';
              EL.append(documentFragment);
            };
            document.onreadystatechange = () => {
              if (document.readyState === "complete") {
                const html = IFRAME.initHTML();
                setHTML(html);
              }
            };
            const resizeObserver = new ResizeObserver((entries) => {
              for (const entry of entries) {
                IFRAME.style.height = entry.target.clientHeight + 30 +'px';
              }
            });
            resizeObserver.observe(EL);
            window.addEventListener('unload', () => resizeObserver.disconnect());
          </script>
        </body>
      </html>
    `;

    return getBlobURL(source, 'text/html');
  };

  useEffect(() => {
    let url = '';
    if (ref.current && tilda.content) {
      // Отзываем предыдущий URL
      if (ref.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(ref.current.src);
      }

      url = getGeneratedPageURL({
        cssArr: tilda.css,
        jsArr: tilda.js,
        id: tilda.promoBlockId,
      });
      ref.current.src = url;
      ref.current.initHTML = () => tilda.content;
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [tilda]);

  useEffect(() => {
    const handleError = onError
      ? onError
      : () => {
          console.error('Iframe loading failed');
        };
    const iframe = ref.current;

    if (iframe) {
      iframe.addEventListener('error', handleError);
      return () => iframe.removeEventListener('error', handleError);
    }
  }, []);

  return (
    <div className={className ? className : styles.container}>
      <iframe
        ref={ref}
        style={{ width: '100%' }}
        id={`iframe${tilda.promoBlockId}`}
      />
    </div>
  );
};