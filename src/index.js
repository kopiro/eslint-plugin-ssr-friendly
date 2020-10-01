const globalsList = require("./globals");

const isDOMGlobalName = (name) => {
  return name in globalsList;
};

const isModuleScope = (scope) => {
  return scope.type === "module";
};

const isReactFunctionComponent = (scope) => {
  // To detect a React.FC, we check if the return value of this fn is a JSX
  return (
    scope.type === "function" &&
    scope.block.body &&
    scope.block.body.body &&
    scope.block.body.body.find(
      (e) =>
        e &&
        e.type === "ReturnStatement" &&
        e.argument &&
        e.argument.type === "JSXElement"
    )
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

const createFn = (context) => {
  const reportReference = (reference) => {
    const node = reference.identifier;
    const { name } = node;
    if (
      node.parent.type === "UnaryExpression" &&
      node.parent.operator === "typeof"
    ) {
      return;
    }

    if (isModuleScope(reference.from)) {
      context.report({
        node: reference.identifier,
        messageId: "defaultMessage",
        data: {
          name,
          reason: "in module scope",
        },
      });
      return;
    }

    if (isForbiddenMethodInReactClassComponent(reference.from)) {
      context.report({
        node,
        messageId: "defaultMessage",
        data: {
          name,
          reason: "in constructor / render method of a React.Component",
        },
      });
      return;
    }

    // If we are in the first-level of a React FC
    if (isReactFunctionComponent(reference.from)) {
      context.report({
        node,
        messageId: "defaultMessage",
        data: {
          name,
          reason: "in first render-cycle of a React.FC",
        },
      });
    }
  };

  return {
    Program() {
      const scope = context.getScope();

      // Report variables declared elsewhere (ex: variables defined as "global" by eslint)
      scope.variables.forEach((variable) => {
        if (!variable.defs.length && isDOMGlobalName(variable.name)) {
          variable.references.forEach(reportReference);
        }
      });

      // Report variables not declared at all
      scope.through.forEach((reference) => {
        if (isDOMGlobalName(reference.identifier.name)) {
          reportReference(reference);
        }
      });
    },
  };
};

module.exports = {
  rules: {
    "ssr-friendly": {
      meta: {
        messages: {
          defaultMessage:
            "Use of DOM global '{{name}}' is forbidden {{reason}}",
        },
      },
      create: createFn,
    },
  },
};
