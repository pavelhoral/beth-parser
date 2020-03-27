import StringsHandler from "./StringsHandler";

/**
 * Strings data parser.
 */
export default class StringsParser {

  /**
   * @param buffer Strings data buffer.
   * @param padded Whether string data uses size padding.
   * @param encoding String encoding.
   */
  constructor(
      private buffer: Buffer,
      private padded = false,
      private encoding = "utf-8") {
  }

  /**
   * Parse strings data using the given handler.
   * @param handler Strings handler.
   */
  parse(handler: StringsHandler) {
    const count = this.buffer.readUInt32LE(0);
    const start = (count + 1) * 8; // Data starts after dictionary
    for (let i = 8; i < start; i += 8) {
      handler(
          this.buffer.readUInt32LE(i),
          this.parseString(start + this.buffer.readUInt32LE(i + 4)));
    }
  }

  /**
   * Parse string at the given offset.
   * @param offset Offset inside data buffer.
   */
  private parseString(offset: number): string {
      const start = this.padded ? offset + 4 : offset;
      let end = start;
      if (this.padded) {
          end += this.buffer.readUInt32LE(offset) - 1;
      } else {
          while (this.buffer[end] != 0 || end >= this.buffer.length) {
              end++;
          }
      }
      return this.buffer.toString(this.encoding, start, end);
  }

}
