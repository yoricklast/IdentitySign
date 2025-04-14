// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
  interface Window {
    bootstrap: typeof import("bootstrap");
  }
  const APPLICATION_VERSION: string;
}

export {};
