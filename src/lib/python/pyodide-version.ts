/**
 * Pyodide version pinned for both the browser (loaded from the jsdelivr CDN) and the Node
 * tests (the same package). Never `latest`: a new Pyodide can change NumPy output and
 * break the lesson examples.
 */
export const PYODIDE_VERSION = "0.29.4";

/** Base URL of the Pyodide runtime files for {@link PYODIDE_VERSION}. */
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
