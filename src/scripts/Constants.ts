import System from 'svelte-system-info'

// 2GB
export const MAX_UPLOAD_SIZE: number = 2 * 1000 * 1000 * 1000;

// 1Mb chunks
export const FILEREAD_CHUNK_SIZE: number = 1024 * 1024;
export const UPLOAD_CHUNK_SIZE: number = 1024 * 1024;

// progress bar smooth time in seconds.
export const SMOOTH_TIME: number = 2;

export const PKG_URL = `http://localhost:8087`

export const METRICS_HEADER = {
  "X-PostGuard-Client-Version": `${System.BrowserVersion},${System.BrowserVersion},"IdentitySign","0.1"`,
};
