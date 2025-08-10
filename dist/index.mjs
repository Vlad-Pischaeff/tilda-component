// src/TildaComponent.tsx
import { useEffect, useRef } from "react";

// src/TildaComponent.module.scss
var TildaComponent_module_default = {};

// src/TildaComponent.tsx
import { jsx } from "react/jsx-runtime";
var TildaComponent = ({ tilda, className }) => {
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
    if (ref.current) {
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