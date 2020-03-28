import ModfileHandler, { ModfileHeader, ParseChildren } from './ModfileHandler';
import { GroupType } from './ModfileDefs';
import ModfileType from "./ModfileType";
import { renderFormId, renderYamlLike } from "../utils";

/**
 * Basic ASCII types.
 */
const ASCII_TYPES = Object.values(ModfileType.build("EDID"));

/**
 * Simple handler implementation.
 */
export default class DefaultModfileHandler extends ModfileHandler {

  /**
   * Modfile root array.
   */
  root = [] as any[];

  /**
   * Childern array stack.
   */
  private stack = [this.root] as any[];

  handleHeader(header: ModfileHeader) {
    this.root.push(header);
  }

  handleGroup(type: number, label: number, parse: ParseChildren) {
    // Prepare children array
    const children = [];
    // Register in parent
    const head = this.stack[this.stack.length - 1];
    head.push({ [`GRUP[${type === GroupType.TOP ? ModfileType.decode(label) : renderFormId(label)}]`]: children });
    // Parse children
    this.stack.push(children);
    parse(this);
    this.stack.pop();
  }

  handleRecord(type: number, size: number, flags: number, formId: number, parse: ParseChildren) {
    // Prepare children array
    const children = [];
    // Register in parent
    const head = this.stack[this.stack.length - 1];
    head.push({ [`${ModfileType.decode(type)}[${renderFormId(formId)}]`]: children });
    // Parse children
    this.stack.push(children);
    parse(this);
    this.stack.pop();
  }

  handleField(type: number, size: number, buffer: Buffer, offset: number) {
    const head = this.stack[this.stack.length - 1];
    if (ASCII_TYPES.indexOf(type) > -1) {
      head.push({ [ModfileType.decode(type)]:  buffer.toString("ascii", offset, offset + size - 1) });
    } else {
      head.push({ [ModfileType.decode(type)]: Buffer.from(buffer.subarray(offset, offset + size)) });
    }
  }

}
