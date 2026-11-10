"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { PythonClient, type RuntimeStatus } from "./python-client";

/** What the lesson's Python users (arena and demos) share. */
interface PythonRuntimeValue {
  client: PythonClient | null;
  runtime: RuntimeStatus;
}

const PythonRuntimeContext = createContext<PythonRuntimeValue | null>(null);

/**
 * Creates the Python worker. The bundler turns the URL into a separate file, so the worker
 * code never runs on the page's main thread.
 *
 * @returns A new worker running `python.worker.ts`.
 */
function createPythonWorker(): Worker {
  return new Worker(new URL("../../workers/python.worker.ts", import.meta.url), {
    type: "module",
  });
}

/**
 * One Python runtime per lesson page, shared by the arena and the theory demos, so the page
 * loads Pyodide once. The worker starts only when a user calls `warm()`.
 *
 * @param props.children - The lesson page.
 */
export function PythonRuntimeProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<PythonClient | null>(null);
  const [runtime, setRuntime] = useState<RuntimeStatus>({ state: "idle" });

  useEffect(() => {
    const next = new PythonClient(createPythonWorker, setRuntime);
    // The client is created in the browser only; workers do not exist on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClient(next);
    return () => next.dispose();
  }, []);

  return (
    <PythonRuntimeContext.Provider value={{ client, runtime }}>{children}</PythonRuntimeContext.Provider>
  );
}

/**
 * The lesson's Python runtime. By default it starts loading when the caller mounts (brief
 * Part 6.3: load as soon as a view that needs Python opens).
 *
 * @param autoWarm - Start loading on mount. Pass `false` to load only on the first request.
 * @returns The client (null until mounted in the browser) and the loading status.
 * @throws When used outside {@link PythonRuntimeProvider}.
 */
export function usePythonRuntime(autoWarm = true): PythonRuntimeValue {
  const value = useContext(PythonRuntimeContext);
  if (!value) {
    throw new Error("usePythonRuntime must be used inside PythonRuntimeProvider");
  }
  const { client } = value;
  useEffect(() => {
    if (autoWarm) {
      client?.warm();
    }
  }, [client, autoWarm]);
  return value;
}
