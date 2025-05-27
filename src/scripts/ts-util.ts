export const NAME_CODE = 4;
export const ADDRESS_CODE = 6;
export const EMAIL_CODE = 8;
export const DEFAULT_BASE_CODE = "SCODE";

export function getDefaultBaseCode(): Promise<unknown> {
  return new Promise((resolve) => {
    fetch("../default-settings.json").then((response) => {
      response.json().then((jsonData) => {
        if (
          jsonData &&
          Object.hasOwn(jsonData, "successBaseCode") &&
          jsonData.successBaseCode != ""
        ) {
          resolve(jsonData.successBaseCode);
        } else {
          resolve(null);
        }
      });
    });
  });
}

export function getProductionVersion(): Promise<unknown> {
  return new Promise((resolve) => {
    fetch("../default-settings.json").then((response) => {
      response.json().then((jsonData) => {
        if (
          jsonData &&
          Object.hasOwn(jsonData, "productionVersion") &&
          jsonData.productionVersion != null
        ) {
          resolve(jsonData.productionVersion);
        } else {
          resolve(null);
        }
      });
    });
  });
}
