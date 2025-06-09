const { RuleTester } = require("eslint");
const pkg = require("../package.json");
const plugin = require("../src/index");

const pluginName = pkg.name.replace("eslint-plugin-", "");

const ruleTester = new RuleTester({
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
});

ruleTester.run("no-dom-globals-in-module-scope", plugin.rules["no-dom-globals-in-module-scope"], {
  valid: [
    "/var/www/file.test.js",
    "/var/www/file.test.jsx",
    "/var/www/file.test.ts",
    "/var/www/file.test.tsx",
  ].map((filename) => ({
    code: `const px = devicePixelRatio;`, // definitely an error
    filename,
  })),
  invalid: ["/var/www/file.js", "/var/www/file.ts"].map((filename) => ({
    code: `const px = devicePixelRatio;`, // definitely an error
    filename,
    errors: [{ message: /.*/ }],
  })),
});

ruleTester.run("no-dom-globals-in-module-scope", plugin.rules["no-dom-globals-in-module-scope"], {
  valid: [
    `function getPixelRatio() { return devicePixelRatio; }`,
    `const getPixelRatio = () => devicePixelRatio`,
    `const isRetina = () => devicePixelRatio >= 2`,
    `const isWindowAvailable = typeof window !== "undefined"`,
    `function createNode() { const analyserNode = new AnalyserNode; return analyserNode; }`,
    `export type GenericProps = {
      icon?: React.SVGAttributes<SVGSymbolElement>
    }`,
  ].map((code) => ({ code })),
  invalid: [
    `const px = devicePixelRatio;`,
    `const retina = (devicePixelRatio > 2)`,
    `const dimensions = [screenX]`,
    `const offsets = { x: pageXOffset };`,
    `const tb = window.toolbar`,
    `const gainNode = new GainNode(context, options)`,
  ].map((code) => ({
    code,
    errors: [{ message: /Use of DOM global .* module scope/ }],
  })),
});

ruleTester.run("no-dom-globals-in-constructor", plugin.rules["no-dom-globals-in-constructor"], {
  valid: [
    `class myClass {
      constructor() {}
      init() {
        this.isRetina = window.devicePixelRatio >= 2;
      }
    }`,
    `class myClass {
      componentDidMount() {
        document.title = "Otto";
      }
    }`,
  ].map((code) => ({ code })),
  invalid: [
    `class myClass {
      constructor() {
        this.scrollX = scrollX;
      }
    }`,
    `class myClass {
      constructor() {
        window.addEventListener('resize', () => {});
      }
    }`,
    `class myClass {
      constructor() {
        window.ondrag = function() {};
      }
    }`,
    `class myClass {
      constructor() {
        document.title = "Otto";
      }
    }`,
    `class Header extends React.Component {
      constructor() {
        this.isRetina = window.devicePixelRatio >= 2;
      }
    }`,
  ].map((code) => ({
    code,
    errors: [{ message: /Use of DOM global .* constructor/ }],
  })),
});

ruleTester.run("no-dom-globals-in-react-cc-render", plugin.rules["no-dom-globals-in-react-cc-render"], {
  valid: [
    `class Header extends React.Component {
        componentDidMount() {
          this.setState({ isRetina: devicePixelRatio >= 2 });
        }
        render() {
            return <div data-is-retina={this.state.isRetina} />;
        }
       }`,
    `class Header extends React.Component {
        componentDidMount() {
            document.title = "Otto";
        }
        render() {
            return <div data-is-retina={this.state.isRetina} />;
        }
      }`,
  ].map((code) => ({ code })),
  invalid: [
    `class Header extends React.Component {
        render() {
          return <div data-is-retina={window.devicePixelRatio >= 2} />;
        }
       }`,
    `class Header extends React.Component {
        render() {
          const width = window.innerWidth;
          return <div style={{ width }} />;
        }
       }`,
    `class Header extends React.Component {
        render() {
          const width = window.innerWidth;
          return null;
        }
       }`,
  ].map((code) => ({
    code,
    errors: [{ message: /Use of DOM global .* render/ }],
  })),
});

ruleTester.run("no-dom-globals-in-react-fc", plugin.rules["no-dom-globals-in-react-fc"], {
  valid: [
    `const Header = () => {
      useEffect(() => {
          document.title = "Otto";
      }, []);
      return <div />;
    }`,
    `const Header = () => {
      const image = useRef<HTMLImageElement>(null)
      return <div />;
    }`,
    `const Header = () => {
      useEffect(() => {
          window.addEventListener('resize', () => {});
      }, []);
      return <div />;
    }`,
    `const Header = React.forwardRef(function (props, ref) {
      useEffect(() => {
          window.addEventListener('resize', () => {});
      }, []);
      return <div {...props} ref={ref} />;
    })`,
    `const Header = () => {
      useEffect(() => {
          window.addEventListener('resize', () => {});
      }, []);
      return true ? <div /> : <div />;
    }`,
  ].map((code) => ({ code })),
  invalid: [
    `const Header = () => {
      document.title = "Otto";
      return <div />;
    }`,
    `const Header = () => {
      const width = window.innerWidth;
      return <div style={{ width }} />;
    }`,
    `const Header = () => {
      window.addEventListener('resize', () => {});
      return <div />;
    }`,
    `const Header = () => {
      document.title = "Otto";
      return <><div>Header</div></>;
    }`,
    `const Header = function ({url}) {
      const href = url + window.location.hash
      return <>{href}</>;
    }`,
    `function Header ({url}) {
      const href = url + window.location.hash
      return <>{href}</>;
    }`,
    `function Header({url}) {
      const href = url + window.location.hash;
      return null
    }`,
    `const Header = React.forwardRef(function (props, ref) {
      const href = url + window.location.hash
      return <div {...props} ref={ref}>{href}</div>;
    })`,
    `const Header = () => {
      document.title = "Otto";
      return true ? <div /> : <div />;
    }`,
  ].map((code) => ({
    code,
    errors: [{ message: /Use of DOM global .* FC/ }],
  })),
});
