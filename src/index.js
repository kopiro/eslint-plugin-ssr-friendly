const { browser: browserGlobals, node: nodeGlobals } = require("globals");
const pkg = require("../package.json");

const pluginName = pkg.name.replace("eslint-plugin-", "");

const isDOMGlobalName = (name) => {
  return name in browserGlobals && !(name in nodeGlobals);
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
  const { name, parent } = node;

  // Make sure that `typeof MYVAR` is always allowed
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

const createRule = (name, description, defaultMessage) => {
  return {
    [name]: {
      meta: {
        type: "problem",
        docs: {
          description,
          recommended: true,
        },
        messages: {
          defaultMessage,
        },
      },
      create: createFn(name),
    },
  };
};

const rules = {
  ...createRule(
    "no-dom-globals-in-module-scope",
    "disallow use of DOM globals in module scope",
    "Use of DOM global '{{name}}' is forbidden in module scope"
  ),
  ...createRule(
    "no-dom-globals-in-constructor",
    "disallow use of DOM globals in class constructors",
    "Use of DOM global '{{name}}' is forbidden in class constructors, consider moving this to componentDidMount() or equivalent for non React components"
  ),
  ...createRule(
    "no-dom-globals-in-react-cc-render",
    "disallow use of DOM glsobals in render() method of a React class-component",
    "Use of DOM global '{{name}}' is forbidden in render(), consider moving this to componentDidMount()"
  ),
  ...createRule(
    "no-dom-globals-in-react-fc",
    "disallow use of DOM globals in the render-cycle of a React FC",
    "Use of DOM global '{{name}}' is forbidden in the render-cycle of a React FC, consider moving this inside useEffect()"
  ),
};

console.log(rules);

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
