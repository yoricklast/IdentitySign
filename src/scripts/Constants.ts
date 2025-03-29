import System from 'svelte-system-info'

export const PKG_URL = `http://localhost:8087`

export const POSTGUARD_FILE = "postguard.enc"

export const METRICS_HEADER = {
  "X-PostGuard-Client-Version": `${System.BrowserVersion},${System.BrowserVersion},"IdentitySign","0.1"`,
};
