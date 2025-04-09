import { loadPyodide } from "pyodide";

/** Implement Singleton Pattern for Pyodide instance */
export const pyodide = (function () {
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
  private _initialized: Promise<void>;
  
  constructor() {
    this._output = console.log;
    this._pyodide = null;

    this._initialized = this._initialize();
  }
  
  private async _initialize() {
    try {
      this._pyodide = await loadPyodide({
        /* 불러올 WASM 모듈 경로 (버전포함) */
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full",
        /* WASM 모듈 내부 표준 출력 방식 */
        stdout: (text) => {
          this._output(text);
        },
        /* WASM 모듈 내부 오류 출력 방식 */
        stderr: (text) => {
          this._output(text);
        },
      });

      console.log(
        this._pyodide.runPython(`
            import sys
            sys.version
        `)
      );

      this._pyodide.runPython('print("Hello from Python!")');
    } catch (error) {
      console.error("Failed to initialize Pyodide:", error);
      throw error;
    }
  }
  
  setOutput(output: (text: string) => void) {
    this._output = output;
  }
  
  async run(code: string) {
    await this._initialized;
    if (this._pyodide) {
      return this._pyodide.runPython(code);
    }
  }
  
  async runAsync(code: string) {
    await this._initialized;
    if (this._pyodide) {
      return this._pyodide.runPythonAsync(code);
    }
  }
}

export default pyodide.getInstance();
