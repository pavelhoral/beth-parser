
import { extname } from "path";
import StringsSerializer from "./StringsSerializer";
import { writeFileSync } from "fs";

/**
 * Strings file writer (high-level API for serializer).
 */
export default class StringsWriter {

  constructor(private encoding = "utf-8") {
  }

  /**
   * Write strings data into buffer.
   * @param strings Strings data.
   * @param padded Whether to use size padding.
   */
  writeBuffer(strings: { [id: number]: string }, padded = false): Buffer {
    const stringsSerializer = new StringsSerializer(padded, this.encoding);
    return stringsSerializer.serialize(strings);
  }

  /**
   * Write strings data into the specified file.
   * @param strings Strings data.
   * @param filename Target file.
   */
  writeFile(strings: { [id: number]: string }, filename: string): void {
    const outputBuffer = this.writeBuffer(strings, extname(filename) !== ".STRINGS");
    writeFileSync(filename, outputBuffer);
  }

}
