import { useState, useEffect } from "react";
import "./App.css";

import pyodide from "./api/pyodide";

function App() {
  const [timeData, setTimeData] = useState("10,15,22\n12,11,14\n8,16,23");
  const [eventData, setEventData] = useState("1,1,1\n0,1,0\n1,0,1");
  const [groupData, setGroupData] = useState("0,0,0\n1,1,1\n0,1,0");
  const [isLoading, setIsLoading] = useState(true);
  const [pyoutput, setPyoutput] = useState("");
  const [result, setResult] = useState("");
  
  useEffect(() => {
    // Setup output handler
    pyodide.setOutput((text) => {
      setPyoutput(prev => prev + text + "\n");
    });
    
    // Install lifelines package when Pyodide is ready
    const setupPyodide = async () => {
      try {
        // First make sure Pyodide is loaded and check Python version
        await pyodide.run(`
          import sys
          print(f"Python version: {sys.version}")
        `);
        
        // Load micropip using the JavaScript API
        // This follows the exact error message instructions
        setPyoutput("Loading micropip package...");
        await pyodide._pyodide.loadPackage("micropip");
        
        // Now install lifelines
        setPyoutput(prev => prev + "\nInstalling lifelines package...");
        await pyodide.runAsync(`
async def install_packages():
    import micropip
    await micropip.install('lifelines')
    print("Lifelines package installed successfully!")

await install_packages()
        `);
        
        setIsLoading(false);
      } catch (error) {
        setPyoutput("Error setting up Pyodide: " + String(error));
      }
    };
    
    setupPyodide();
  }, []);
  
  const runLogRankTest = () => {
    setPyoutput("");
    setResult("");
    
    try {
      const code = `
import numpy as np
from lifelines.statistics import logrank_test

# Parse input data
times = np.array([${timeData.split('\n').map(row => `[${row}]`).join(',')}])
events = np.array([${eventData.split('\n').map(row => `[${row}]`).join(',')}])
groups = np.array([${groupData.split('\n').map(row => `[${row}]`).join(',')}])

# Flatten arrays
times_flat = times.flatten()
events_flat = events.flatten()
groups_flat = groups.flatten()

# Run logrank test
results = logrank_test(times_flat, groups_flat, events_flat)
print(results.summary)

# Return p-value as result
p_value = results.p_value
f"Log-rank test p-value: {p_value:.4f}"
      `;
      
      const testResult = pyodide.run(code);
      setResult(testResult);
    } catch (error) {
      setPyoutput("Error running analysis: " + String(error));
    }
  };

  return (
    <>
      <h1>Lifelines Log-rank Test</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h3>Time Data (comma-separated, one row per line)</h3>
          <textarea
            style={{
              width: "100%",
              height: "100px",
              fontFamily: "monospace",
              fontSize: "1rem",
            }}
            value={timeData}
            onChange={(e) => setTimeData(e.target.value)}
          />
        </div>
        
        <div>
          <h3>Event Data (1=event occurred, 0=censored)</h3>
          <textarea
            style={{
              width: "100%",
              height: "100px",
              fontFamily: "monospace",
              fontSize: "1rem",
            }}
            value={eventData}
            onChange={(e) => setEventData(e.target.value)}
          />
        </div>
        
        <div>
          <h3>Group Data (group assignment)</h3>
          <textarea
            style={{
              width: "100%",
              height: "100px",
              fontFamily: "monospace",
              fontSize: "1rem",
            }}
            value={groupData}
            onChange={(e) => setGroupData(e.target.value)}
          />
        </div>

        <button
          disabled={isLoading}
          onClick={runLogRankTest}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: isLoading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Loading Lifelines..." : "Run Log-rank Test"}
        </button>

        {result && (
          <div style={{ margin: "20px 0", padding: "15px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
            <h3>Result:</h3>
            <p style={{ fontWeight: "bold" }}>{result}</p>
          </div>
        )}

        <div>
          <h3>Output:</h3>
          <pre style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "10px", 
            borderRadius: "4px",
            maxHeight: "200px",
            overflow: "auto"
          }}>
            {pyoutput}
          </pre>
        </div>
      </div>
    </>
  );
}

export default App;
