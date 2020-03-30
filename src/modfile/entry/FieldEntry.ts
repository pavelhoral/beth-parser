import { decodeTypeTag } from "../../utils";

/**
 * Record field entry.
 */
export default class FieldEntry {

  constructor(
      public type: number,
      public value: Buffer) {
  }

  /**
   * Convert to a more user-friendly format.
   */
   toJSON(): any {
    return {
      [decodeTypeTag(this.type)]: this.value.toString("hex").toUpperCase()
    };
  }

}
