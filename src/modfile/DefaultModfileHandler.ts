import ModfileHandler, { ModfileHeader, ParseChildren } from './ModfileHandler';
import { GroupType } from './ModfileDefs';
import ModfileType from "./ModfileType";

/**
 * Basic types used by the handler.
 */
const {
  EDID
} = ModfileType.build("EDID");

/**
 * Simple handler implementation.
 */
export default class DefaultModfileHandler extends ModfileHandler {

  protected stack = [];

  handleHeader(header: ModfileHeader) {
    this.stack = [{
      label: "ROOT",
      ...header,
      children: []
    }];
  }

  handleGroup(type: number, label: number, parse: ParseChildren) {
    const head = this.stack[this.stack.length - 1];
    // Push group on the stack
    this.stack.push({
      label: type === GroupType.TOP ? ModfileType.decode(label) : label,
      children: []
    });
    // Parse children entries
    parse(this);
    // Remove from stack and add to parent
    head.children.push(this.stack.pop());
  }

  handleRecord(type: number, size: number, flags: number, formId: number, parse: ParseChildren) {
    const head = this.stack[this.stack.length - 1];
    // Push record on the stack
    this.stack.push({
      type: ModfileType.decode(type),
      size: size,
      flags: flags,
      formId: formId
    });
    // Parse children entries
    parse(this);
    // Remove from stack and add to parent
    head.children.push(this.stack.pop());
  }

  handleField(type: number, size: number, buffer: Buffer, offset: number) {
    const head = this.stack[this.stack.length - 1];
    // Add editor identifier
    if (type == EDID) {
      head.editorId = buffer.toString("ascii", offset, offset + size - 1);
    }
  }

}
