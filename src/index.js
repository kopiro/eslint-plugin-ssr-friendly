const { browser, node } = require("globals");
const pkg = require("../package.json");

const pluginName = pkg.name.replace("eslint-plugin-", "");

const isDOMGlobalName = (name) => {
  return name in browser && !(name in node);
};

const isReturnValueJSX = (scope) => {
  if (scope.block && scope.block.body && scope.block.body.body) {
    return (
      scope.type === "function" &&
      scope.block.body.body.find(
        (e) =>
          e &&
          e.type === "ReturnStatement" &&
          e.argument &&
          e.argument.type === "JSXElement"
      )
    );
  }
  return false;
};

const isReactFunctionComponent = (scope) => {
  return isReturnValueJSX(scope);
};

const isConstructorInClass = (scope) => {
  if (scope.block && scope.block.parent) {
    const { type, kind } = scope.block.parent;
    return type === "MethodDefinition" && kind === "constructor";
  }
  return false;
};

const isRenderMethodInReactCC = (scope) => {
  if (scope.block && scope.block.parent) {
    const { type, kind, key } = scope.block.parent;
    return (
      type === "MethodDefinition" &&
      kind === "method" &&
      key.name === "render" &&
      isReturnValueJSX(scope)
    );
  }
  return false;
};

const reportReference = (context, rule) => (reference) => {
  const node = reference.identifier;
  const { name } = node;
  const { parent } = node;

  // Make sure that `typeof window` is always allowed
  if (parent.type === "UnaryExpression" && parent.operator === "typeof") {
    return;
  }

  switch (rule) {
    case "no-dom-globals-in-module-scope":
      if (
        reference.from.type === "module" ||
        reference.from.upper.type === "global"
      ) {
        context.report({
          node,
          messageId: "defaultMessage",
          data: {
            name,
          },
        });
      }
      return;

    case "no-dom-globals-in-constructor":
      if (isConstructorInClass(reference.from)) {
        context.report({
          node,
          messageId: "defaultMessage",
          data: {
            name,
          },
        });
      }
      return;

    case "no-dom-globals-in-react-cc-render":
      if (isRenderMethodInReactCC(reference.from)) {
        context.report({
          node,
          messageId: "defaultMessage",
          data: {
            name,
          },
        });
      }
      return;

    case "no-dom-globals-in-react-fc":
      if (isReactFunctionComponent(reference.from)) {
        context.report({
          node,
          messageId: "defaultMessage",
          data: {
            name,
          },
        });
      }
      return;

    default:
      // eslint-disable-next-line no-console
      console.error(`Unexpected rule-name: ${rule}`);
      break;
  }
};

const createFn = (rule) => (context) => {
  return {
    Program() {
      const scope = context.getScope();

      // Report variables declared elsewhere (ex: variables defined as "global" by eslint)
      scope.variables.forEach((variable) => {
        if (!variable.defs.length && isDOMGlobalName(variable.name)) {
          variable.references.forEach(reportReference(context, rule));
        }
      });

      // Report variables not declared at all
      scope.through.forEach((reference) => {
        if (isDOMGlobalName(reference.identifier.name)) {
          reportReference(context, rule)(reference);
        }
      });
    },
  };
};

const rules = {
  "no-dom-globals-in-module-scope": {
    meta: {
      type: "problem",
      docs: {
        description: "disallow use of DOM globals in module scope",
        recommended: true,
      },
      messages: {
        defaultMessage:
          "Use of DOM global '{{name}}' is forbidden in module scope",
      },
    },
    create: createFn("no-dom-globals-in-module-scope"),
  },
  "no-dom-globals-in-constructor": {
    meta: {
      type: "problem",
      docs: {
        description: "disallow use of DOM globals in class constructors",
        recommended: true,
      },
      messages: {
        defaultMessage:
          "Use of DOM global '{{name}}' is forbidden in class constructors, consider moving this to componentDidMount() or equivalent for non React components",
      },
    },
    create: createFn("no-dom-globals-in-constructor"),
  },
  "no-dom-globals-in-react-cc-render": {
    meta: {
      type: "problem",
      docs: {
        description:
          "disallow use of DOM globals in render() method of a React class-component",
        recommended: true,
      },
      messages: {
        defaultMessage:
          "Use of DOM global '{{name}}' is forbidden in render(), consider moving this to componentDidMount()",
      },
    },
    create: createFn("no-dom-globals-in-react-cc-render"),
  },
  "no-dom-globals-in-react-fc": {
    meta: {
      type: "problem",
      docs: {
        description:
          "disallow use of DOM globals in the render-cycle of a React FC",
        recommended: true,
      },
      messages: {
        defaultMessage:
          "Use of DOM global '{{name}}' is forbidden in the render-cycle of a React FC, consider moving this inside useEffect()",
      },
    },
    create: createFn("no-dom-globals-in-react-fc"),
  },
};

module.exports = {
  configs: {
    recommended: {
      plugins: [pluginName],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: Object.keys(rules).reduce((carry, key) => {
        // eslint-disable-next-line no-param-reassign
        carry[`${pluginName}/${key}`] = "error";
        return carry;
      }, {}),
    },
  },
  rules,
};
