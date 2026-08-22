import { WalletAttributeType } from "./wallet-attribute";

export const NAME_CODE = 4;
export const ADDRESS_CODE = 6;
export const EMAIL_CODE = 8;
export const DEFAULT_BASE_CODE = "SCODE";

// Friendly attribute names
const LEGALNAMEATTRIBUTE = "pbdf.gemeente.personalData.fullname";
const LEGALNAMEATTRIBUTEFRIENDLY = "Legal name";
const EMAILATTRIBUTE = "pbdf.sidn-pbdf.email.email";
const EMAILATTRIBUTEFRIENDLY = "Email";

// Friendly data sources
/**
 * Friendly name for a municipality as data source.
 */
const MUNICIPALITY_DATASOURCE = "Municipality";
/**
 * Friendly name for email verification as a data source.
 */
const EMAIL_DATASOURCE = "Email verification";
/**
 * Friendly name for any *other* data source.
 * Used when a more specific alternative is not defined.
 */
const OTHER_DATASOURCE = "Other";

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
 * Obtain demo mode setting from default settings.
 * @returns Demo mode setting.
 */
export function getDemoMode(): Promise<unknown> {
  return new Promise((resolve) => {
    fetch("../default-settings.json").then((response) => {
      response.json().then((jsonData) => {
        if (
          jsonData &&
          Object.hasOwn(jsonData, "demoMode") &&
          jsonData.demoMode != null
        ) {
          resolve(jsonData.demoMode);
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

/**
 * Obtain a user-friendly data source name for a **crypto** attribute.
 * Use *getFriendlyDummyDataSource* for dummy attributes.
 * @param attributeName The attribute name for which to get the data source.
 * @returns Data source name if found, otherwise returns "other" data source name.
 */
export function getFriendlyCryptoDataSource(attributeName: string): string {
  switch (attributeName) {
    case LEGALNAMEATTRIBUTE: {
      return MUNICIPALITY_DATASOURCE;
    }
    case EMAILATTRIBUTE: {
      return EMAIL_DATASOURCE;
    }
    default: {
      return OTHER_DATASOURCE;
    }
  }
}

/**
 * Obtain a user-friendly data source name for a **dummy** attribute.
 * Use *getFriendlyCryptoDataSource* for crypto attributes.
 * @param attributeType The attribute type for which to get the data source.
 * @returns Data source name if found, otherwise returns "other" data source name.
 */
export function getFriendlyDummyDataSource(
  attributeType: WalletAttributeType,
): string {
  switch (attributeType) {
    case WalletAttributeType.Name:
    case WalletAttributeType.Address: {
      return MUNICIPALITY_DATASOURCE;
    }
    case WalletAttributeType.Email: {
      return EMAIL_DATASOURCE;
    }
    default: {
      return OTHER_DATASOURCE;
    }
  }
}
