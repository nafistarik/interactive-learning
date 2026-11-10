/* Server-safe: imported by the root layout, so no React client APIs here. */

/** Storage key of the theme the user picked. Missing means "follow the system". */
export const THEME_KEY = "vlp:theme";

/**
 * Runs before the first paint (inline in `<head>`): applies the picked theme, or the system
 * theme when none was picked, so the page never flashes the wrong colours.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;d.style.colorScheme=t})()`;
