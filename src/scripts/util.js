/**
 * Get the current developer mode setting from localStorage.
 * @returns {boolean} Current developer mode setting. False if not set.
 */
export function getDevMode() {
  if (localStorage.getItem("devMode") == "true") {
    return true;
  } else {
    return false;
  }
}

/**
 * Get the default Yivi URL. Returns null if not set or empty.
 * @returns {Promise} Yivi URL as string or null if not set or empty.
 */
export function getDefaultYiviUrl() {
  return new Promise((resolve) => {
    fetch("../default-settings.json").then((response) => {
      response.json().then((jsonData) => {
        if (
          jsonData &&
          Object.hasOwn(jsonData, "yiviUrl") &&
          jsonData.yiviUrl != ""
        ) {
          devLog(`Found default Yivi URL "${jsonData.yiviUrl}".`);
          resolve(jsonData.yiviUrl);
        } else {
          resolve(null);
        }
      });
    });
  });
}

export function getProductionVersion() {
  return new Promise((resolve) => {
    fetch("../default-settings.json").then((response) => {
      response.json().then((jsonData) => {
        if (
          jsonData &&
          Object.hasOwn(jsonData, "prod") &&
          jsonData.prod != null
        ) {
          resolve(jsonData.prod);
        } else {
          resolve(null);
        }
      });
    });
  });
}

/**
 * Log to console if in developer mode.
 * @param {*} message Message to log.
 */
export function devLog(message) {
  if (getDevMode()) {
    console.log(message);
  }
}

/**
 * Warn to console if in developer mode.
 * @param {*} message Message to log.
 */
export function devWarn(message) {
  if (getDevMode()) {
    console.warn(message);
  }
}

/**
 * Error to console if in developer mode.
 * @param {*} message Message to log.
 */
export function devError(message) {
  if (getDevMode()) {
    console.error(message);
  }
}
