// src/TildaComponent.tsx
import { useEffect, useRef } from "react";

// src/TildaComponent.module.scss
var TildaComponent_module_default = {};

// src/TildaComponent.tsx
import { jsx } from "react/jsx-runtime";
var TildaComponent = ({
  tilda,
  className,
  onError,
  onLoad
}) => {
  const ref = useRef(null);
  const getGeneratedPageURL = ({ cssArr, jsArr, id }) => {
    const getBlobURL = (code, type) => {
      const blob = new Blob([code], { type });
      return URL.createObjectURL(blob);
    };
    const getCSS = (cssArray) => cssArray.map((css) => `<link rel="stylesheet" type="text/css" href="${css}" />`).join(" ");
    const getJS = (jsArray) => jsArray.map((js) => `<script src="${js}" blocking="render"></script>`).join(" ");
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
                // \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0435\u043C \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u043E\u043A\u043D\u043E \u043E \u043F\u043E\u043B\u043D\u043E\u0439 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430
                window.parent.postMessage({ 
                  type: 'TILDA_CONTENT_LOADED', 
                  blockId: ${id} 
                }, '*');
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
    return getBlobURL(source, "text/html");
  };
  useEffect(() => {
    let url = "";
    if (ref.current && tilda.content) {
      if (ref.current.src.startsWith("blob:")) {
        URL.revokeObjectURL(ref.current.src);
      }
      url = getGeneratedPageURL({
        cssArr: tilda.css,
        jsArr: tilda.js,
        id: tilda.promoBlockId
      });
      ref.current.src = url;
      ref.current.initHTML = () => tilda.content;
    }
    return () => {
      if (url)
        URL.revokeObjectURL(url);
    };
  }, [tilda]);
  useEffect(() => {
    const handleError = onError || ((error) => {
      console.error("Iframe loading failed:", error);
    });
    const iframe = ref.current;
    if (iframe) {
      iframe.addEventListener("error", handleError);
      return () => iframe.removeEventListener("error", handleError);
    }
  }, [onError]);
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "TILDA_CONTENT_LOADED" && event.data.blockId === tilda.promoBlockId) {
        if (onLoad)
          onLoad();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLoad, tilda.promoBlockId]);
  useEffect(() => {
    const iframe = ref.current;
    const handleIframeLoad = () => {
      console.log("Iframe DOM loaded");
    };
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
      return () => iframe.removeEventListener("load", handleIframeLoad);
    }
  }, []);
  return /* @__PURE__ */ jsx("div", { className: className ? className : TildaComponent_module_default.container, children: /* @__PURE__ */ jsx(
    "iframe",
    {
      ref,
      style: { width: "100%" },
      id: `iframe${tilda.promoBlockId}`
    }
  ) });
};
export {
  TildaComponent
};
//# sourceMappingURL=index.mjs.map