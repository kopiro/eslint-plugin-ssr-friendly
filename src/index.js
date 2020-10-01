const headerMsg = (name) => `Use of DOM global <${name}> is forbidden`;

const isDOMGlobal = (name) => {
  // How did I get this list?
  // Go to https://developer.mozilla.org/en-US/docs/Web/API/Window
  // Run this code in the console to get all window.XYZ keys
  // JSON.stringify($$('#sidebar-quicklinks li code').shift().map(e => e.innerText))
  // Then open a Node REPL, and filter those:
  // JSON.stringify(x.filter(e => typeof globalThis[e] === 'undefined'))
  return [
    "window",
    "applicationCache",
    "caches",
    "closed",
    "controllers",
    "crossOriginIsolated",
    "customElements",
    "defaultStatus",
    "devicePixelRatio",
    "dialogArguments",
    "directories",
    "document",
    "event",
    "frameElement",
    "frames",
    "fullScreen",
    "history",
    "indexedDB",
    "innerHeight",
    "innerWidth",
    "isSecureContext",
    "isSecureContext",
    "length",
    "localStorage",
    "location",
    "locationbar",
    "menubar",
    "mozAnimationStartTime",
    "mozInnerScreenX",
    "mozInnerScreenY",
    "mozPaintCount",
    "name",
    "navigator",
    "onabort",
    "onafterprint",
    "onanimationcancel",
    "onanimationend",
    "onanimationiteration",
    "onappinstalled",
    "onauxclick",
    "onbeforeinstallprompt",
    "onbeforeprint",
    "onbeforeunload",
    "onblur",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextmenu",
    "oncuechange",
    "ondblclick",
    "ondevicelight",
    "ondevicemotion",
    "ondeviceorientation",
    "ondeviceorientationabsolute",
    "ondeviceproximity",
    "ondragdrop",
    "ondurationchange",
    "onended",
    "onerror",
    "onfocus",
    "onformdata",
    "ongamepadconnected",
    "ongamepaddisconnected",
    "ongotpointercapture",
    "onhashchange",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onlanguagechange",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadend",
    "onloadstart",
    "onlostpointercapture",
    "onmessage",
    "onmessageerror",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmozbeforepaint",
    "onpaint",
    "onpause",
    "onplay",
    "onplaying",
    "onpointercancel",
    "onpointerdown",
    "onpointerenter",
    "onpointerleave",
    "onpointermove",
    "onpointerout",
    "onpointerover",
    "onpointerup",
    "onpopstate",
    "onrejectionhandled",
    "onreset",
    "onresize",
    "onscroll",
    "onselect",
    "onselectionchange",
    "onselectstart",
    "onstorage",
    "onsubmit",
    "ontouchcancel",
    "ontouchstart",
    "ontransitioncancel",
    "ontransitionend",
    "onunhandledrejection",
    "onunload",
    "onuserproximity",
    "onvrdisplayactivate",
    "onvrdisplayblur",
    "onvrdisplayconnect",
    "onvrdisplaydeactivate",
    "onvrdisplaydisconnect",
    "onvrdisplayfocus",
    "onvrdisplaypointerrestricted",
    "onvrdisplaypointerunrestricted",
    "onvrdisplaypresentchange",
    "onwheel",
    "opener",
    "origin",
    "outerHeight",
    "outerWidth",
    "pageXOffset",
    "pageYOffset",
    "parent",
    "performance",
    "personalbar",
    "pkcs11",
    "screen",
    "screenLeft",
    "screenTop",
    "screenX",
    "screenY",
    "scrollbars",
    "scrollMaxX",
    "scrollMaxY",
    "scrollX",
    "scrollY",
    "self",
    "sessionStorage",
    "sidebar",
    "speechSynthesis",
    "status",
    "statusbar",
    "toolbar",
    "top",
    "visualViewport",
    "alert",
    "atob",
    "back",
    "blur",
    "btoa",
    "cancelAnimationFrame",
    "cancelIdleCallback",
    "captureEvents",
    "close",
    "confirm",
    "convertPointFromNodeToPage",
    "convertPointFromPageToNode",
    "createImageBitmap",
    "dump",
    "fetch",
    "find",
    "focus",
    "forward",
    "getAttention",
    "getComputedStyle",
    "getDefaultComputedStyle",
    "getSelection",
    "home",
    "matchMedia",
    "minimize",
    "moveBy",
    "moveTo",
    "open",
    "openDialog",
    "postMessage",
    "print",
    "prompt",
    "releaseEvents",
    "requestAnimationFrame",
    "requestFileSystem",
    "requestIdleCallback",
    "resizeBy",
    "resizeTo",
    "restore",
    "routeEvent",
    "scroll",
    "scrollBy",
    "scrollByLines",
    "scrollByPages",
    "scrollTo",
    "setCursor",
    "showModalDialog",
    "sizeToContent",
    "stop",
    "updateCommands",
    "event",
    "afterprint",
    "animationcancel",
    "animationend",
    "animationiteration",
    "beforeprint",
    "beforeunload",
    "blur",
    "copy",
    "cut",
    "DOMContentLoaded",
    "error",
    "focus",
    "hashchange",
    "languagechange",
    "load",
    "message",
    "messageerror",
    "offline",
    "online",
    "orientationchange",
    "pagehide",
    "pageshow",
    "paste",
    "popstate",
    "rejectionhandled",
    "storage",
    "transitioncancel",
    "unhandledrejection",
    "unload",
    "vrdisplayconnect",
    "vrdisplaydisconnect",
    "vrdisplaypresentchange",
    "AbortController",
    "AbortSignal",
    "AbstractRange",
    "Attr",
    "ByteString",
    "CDATASection",
    "CSSPrimitiveValue",
    "CSSValue",
    "CSSValueList",
    "CharacterData",
    "ChildNode",
    "Comment",
    "CustomEvent",
    "DOMConfiguration",
    "DOMError",
    "DOMErrorHandler",
    "DOMException",
    "DOMImplementation",
    "DOMImplementationList",
    "DOMImplementationRegistry",
    "DOMImplementationSource",
    "DOMLocator",
    "DOMObject",
    "DOMParser",
    "DOMPoint",
    "DOMPointInit",
    "DOMPointReadOnly",
    "DOMRect",
    "DOMString",
    "DOMTimeStamp",
    "DOMTokenList",
    "DOMUserData",
    "Document",
    "DocumentFragment",
    "DocumentType",
    "Element",
    "ElementTraversal",
    "Entity",
    "EntityReference",
    "Event",
    "EventTarget",
    "HTMLCollection",
    "MutationObserver",
    "Node",
    "NodeFilter",
    "NodeIterator",
    "NodeList",
    "NonDocumentTypeChildNode",
    "ProcessingInstruction",
    "PromiseResolver",
    "Range",
    "StaticRange",
    "Text",
    "TimeRanges",
    "TreeWalker",
    "TypeInfo",
    "USVString",
    "UserDataHandler",
    "XMLDocument",
  ].includes(name);
};

const isReactFunctionComponent = (scope) => {
  return scope.block.body.body.find(
    (e) => e.type === "ReturnStatement" && e.argument.type === "JSXElement"
  );
};

const isForbiddenMethodInReactClassComponent = (scope) => {
  const methodStmt = scope.block.parent;
  return (
    methodStmt.type === "MethodDefinition" &&
    (methodStmt.kind === "constructor" ||
      (methodStmt.kind === "method" && methodStmt.key.name === "render"))
  );
};

const globalRule = (context) => {
  return {
    Identifier(node) {
      // Skip in case we see "ABC.XYZ" and this is the trigger for XYZ
      // but of course don't skip for "window.window"
      if (node.name !== "window" && node.parent.type === "MemberExpression") {
        return;
      }

      // Make sure that `typeof window` is allowed anywhere
      if (
        node.parent &&
        node.parent.type === "UnaryExpression" &&
        node.parent.operator === "typeof"
      ) {
        return;
      }

      const scope = context.getScope();
      // If this variable has been declared in this scope,
      // then the developer is not referencing to the global window.XYZ var
      if (scope.set.get(node.name)) {
        return;
      }

      // If this is not a forbidden DOM global variable, just early return
      if (!isDOMGlobal(node.name)) {
        return;
      }

      // If the scope of identifier is the global scope, we have a problem for sure
      if (scope.type === "module") {
        context.report({
          node,
          message: `${headerMsg(node.name)} in global scope`,
        });
        return;
      }

      // If we are in a forbidden React Component method
      if (isForbiddenMethodInReactClassComponent(scope)) {
        context.report({
          node,
          message: `${headerMsg(
            node.name
          )} in constructor / render methods of a React CC`,
        });
        return;
      }

      // If we are in the first-level of a React FC
      if (isReactFunctionComponent(scope)) {
        context.report({
          node,
          message: `${headerMsg(
            node.name
          )} in first render-cycle of a React FC`,
        });
      }
    },
  };
};

module.exports = {
  rules: {
    "ssr-friendly": {
      create: globalRule,
    },
  },
};
