import { loadPyodide } from "pyodide";

export const Pyodide = (function () {
  let instance: PythonRunner | null = null;
  function createInstance() {
    const runner = new PythonRunner();
    return runner;
  }
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

class PythonRunner {
  private _output: (text: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- `typeof PyodideAPI` is not typed
  private _pyodide: any;
  constructor() {
    this._output = console.log;
    this._pyodide = null;
    loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full",
      stderr: (text) => {
        this._output(text);
      },
      stdout: (text) => {
        this._output(text);
      },
    }).then((result) => {
      this._pyodide = result;

      console.log(
        this._pyodide.runPython(`
            import sys
            sys.version
        `)
      );

      this._pyodide.runPython('print("Hello from Python!")');
    });
  }
  setOutput(output: (text: string) => void) {
    this._output = output;
  }
  run(code: string) {
    if (this._pyodide) {
      return this._pyodide.runPython(code);
    }
  }
}
