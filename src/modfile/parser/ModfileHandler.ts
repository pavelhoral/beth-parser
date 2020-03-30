import { ChildHandler, ParseChildren, ParseFields } from "./ModfileParser";
import { GroupType } from "../ModfileDefs";
import { GroupEntry, RecordEntry, FieldEntry } from "../entry";
import { ChildEntry } from "../entry/GroupEntry";

/**
 * Default collecting child handler implementation.
 */
export default class ModfileHandler implements ChildHandler {

  /**
   * Modfile root entry.
   */
  root: GroupEntry = new GroupEntry(GroupType.ROOT, 0);

  /**
   * Children array stack.
   */
  private stack: ChildEntry[][] = [this.root.children];

  handleGroup(type: number, _size: number, label: number, parse: ParseChildren): void {
    // Create group entry
    const group = new GroupEntry(type, label);
    // Register in parent
    this.stack[this.stack.length - 1].push(group);
    // Parse children
    this.stack.push(group.children);
    parse(this);
    this.stack.pop();
  }

  handleRecord(type: number, size: number, flags: number, formId: number, parse: ParseFields): void {
    // Prepare children array
    const record = new RecordEntry(type, flags, formId);
    // Register in parent
    this.stack[this.stack.length - 1].push(record);
    // Parse fields
    parse((type: number, size: number, buffer: Buffer, offset: number) => {
      record.fields.push(new FieldEntry(type, Buffer.from(buffer.subarray(offset, offset + size))));
    });
  }

}
