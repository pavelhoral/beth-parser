/**
 * Parse children function.
 */
export interface ParseChildren {

  (handler: ModfileHandler);

}

/**
 * Header field data.
 */
export interface ModfileHeader {

  /**
   * Mod author.
   */
  author: string;

  /**
   * Mod description.
   */
  description: string;

  /**
   * Parent mod names.
   */
  parents: string[];

}

/**
 * Modfile parsing handler.
 */
export default class ModfileHandler {

  /**
   * Handle modfile header entry.
   * @param header Header entry.
   */
  handleHeader(header: ModfileHeader): void {
  }

  /**
   * Handle group based entry.
   * @param type Group type.
   * @param label Group label.
   * @param parse Parse children function.
   */
  handleGroup(type: number, label: number, parse: ParseChildren): void {
  }

  /**
   * Handle record based entry.
   * @param type Record type.
   * @param size Data size (potentially after compression).
   * @param flags Record flags.
   * @param formId Form identifier.
   * @param parse Parse children function.
   */
  handleRecord(type: number, size: number, flags: number, formId: number, parse: ParseChildren): void {
  }

  /**
   * Handle field based entry.
   * @param type Field type.
   * @param size Data size.
   * @param buffer Data buffer.
   * @param offset Data offset within the buffer.
   */
  handleField(type: number, size: number, buffer: Buffer, offset: number): void {
  }

}
