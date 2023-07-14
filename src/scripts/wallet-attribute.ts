/**
 * Supported identity wallet attributes types to sign PDF files with.
 */
export enum WalletAttributeType {
  /**
   * Full name (first + last name) of an individual.
   */
  Name = 0,
  /**
   * Email address.
   */
  Email = 1,
  /**
   * Home address.
   */
  Address = 2,
}

/**
 * Type representing a wallet attribute.
 */
export type WalletAttribute = {
  /**
   * Type of attribute.
   */
  attributeType: WalletAttributeType;
  /**
   * Value assigned to the attribute.
   */
  value: string | Date | number;
};
