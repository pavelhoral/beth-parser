import RecordEntry from "./RecordEntry";
import { GroupType } from "../ModfileDefs";
import { decodeTypeTag } from "../../utils";

export type ChildEntry = GroupEntry|RecordEntry;

/**
 * Group (container) entry.
 */
export default class GroupEntry {

  constructor(
      public type: GroupType,
      public label: number,
      public children: ChildEntry[] = []) {
  }

  /**
   * Convert to a more user-friendly format.
   */
  toJSON(): any {
    return this.type === GroupType.ROOT ? this.children : {
      type: GroupType[this.type] || this.type,
      label: this.type === GroupType.TOP ? decodeTypeTag(this.label) : this.type,
      children: this.children.length ? this.children : undefined
    };
  }

}
