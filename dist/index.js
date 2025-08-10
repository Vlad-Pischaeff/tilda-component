"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  TildaComponent: () => TildaComponent
});
module.exports = __toCommonJS(src_exports);

// src/TildaComponent.tsx
var import_react = require("react");

// src/TildaComponent.module.scss
var TildaComponent_module_default = {};

// src/TildaComponent.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var TildaComponent = ({ tilda, className }) => {
  const ref = (0, import_react.useRef)(null);
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
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: className ? className : TildaComponent_module_default.container, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "iframe",
    {
      ref,
      style: { width: "100%" },
      id: `iframe${tilda.promoBlockId}`
    }
  ) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TildaComponent
});
//# sourceMappingURL=index.js.map