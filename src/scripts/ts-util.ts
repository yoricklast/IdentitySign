export const NAME_CODE = 4;
export const ADDRESS_CODE = 6;
export const EMAIL_CODE = 8;
export const DEFAULT_BASE_CODE = "SCODE";

const LEGALNAMEATTRIBUTE = "pbdf.gemeente.personalData.fullname";
const LEGALNAMEATTRIBUTEFRIENDLY = "Legal name";
const EMAILATTRIBUTE = "pbdf.sidn-pbdf.email.email";
const EMAILATTRIBUTEFRIENDLY = "Email";

/**
 * Obtain default base code setting from default settings.
 * @returns Default base code setting.
 */
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

/**
 * Obtain production version setting from default settings.
 * @returns Production version setting.
 */
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

/**
 * Obtain a user-friendly name for an attribute
 * @param attributeName The attribute name for which to get a friendly version.
 * @returns Friendly attribute name if found, otherwise returns attributeName
 */
export function getFriendlyAttributeName(attributeName: string): string {
  switch (attributeName) {
    case LEGALNAMEATTRIBUTE: {
      return LEGALNAMEATTRIBUTEFRIENDLY;
    }
    case EMAILATTRIBUTE: {
      return EMAILATTRIBUTEFRIENDLY;
    }
    default: {
      return attributeName;
    }
  }
}
