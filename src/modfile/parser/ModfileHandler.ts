import { renderFormId, decodeTypeTag, defineTypeTags } from "../../utils";
import { ChildHandler, ParseChildren, ParseFields } from "./ModfileParser";
import { GroupType } from "../ModfileDefs";

/**
 * Basic ASCII types.
 */
const ASCII_TYPES = Object.values(defineTypeTags("EDID"));

/**
 * Default child handler implementation.
 */
export default class ModfileHandler implements ChildHandler {

  /**
   * Modfile root array.
   */
  root = [] as any[];

  /**
   * Childern array stack.
   */
  private stack = [this.root] as any[];

  handleGroup(type: number, _size: number, label: number, parse: ParseChildren): void {
    // Prepare children array
    const children: any[] = [];
    // Register in parent
    const head = this.stack[this.stack.length - 1];
    head.push({ [`GRUP[${type === GroupType.TOP ? decodeTypeTag(label) : renderFormId(label)}]`]: children });
    // Parse children
    this.stack.push(children);
    parse(this);
    this.stack.pop();
  }

  handleRecord(type: number, size: number, flags: number, formId: number, parse: ParseFields): void {
    // Prepare children array
    const children: any[] = [];
    // Register in parent
    const head = this.stack[this.stack.length - 1];
    head.push({ [`${decodeTypeTag(type)}[${renderFormId(formId)}]`]: children });
    // Parse fields
    parse((type: number, size: number, buffer: Buffer, offset: number) => {
      if (ASCII_TYPES.indexOf(type) > -1) {
        children.push({ [decodeTypeTag(type)]:  buffer.toString("ascii", offset, offset + size - 1) });
      } else {
        children.push({ [decodeTypeTag(type)]: Buffer.from(buffer.subarray(offset, offset + size)) });
      }
    });
  }

}
