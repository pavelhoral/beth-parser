import { FieldEntry } from ".";
import { decodeTypeTag, renderUint32 } from "../../utils";

/**
 * Record (aka Form) entry.
 */
export default class RecordEntry {

  constructor(
      public type: number,
      public flags: number,
      public formId: number,
      public fields: FieldEntry[] = []) {
  }

  /**
   * Convert to a more user-friendly format.
   */
  toJSON(): any {
    return {
      type: decodeTypeTag(this.type),
      flags: renderUint32(this.flags), // XXX This is not a FORM ID
      formId: renderUint32(this.formId),
      fields: this.fields.length ? this.fields : undefined
    };
  }

}
