import * as path from "path";
import * as fs from "fs";

import StringsSerializer from "./StringsSerializer";

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
  writeBuffer(strings: { [id: number]: string }, padded = false) {
    const stringsSerializer = new StringsSerializer(padded, this.encoding);
    return stringsSerializer.serialize(strings);
  }

  /**
   * Write strings data into the specified file.
   * @param strings Strings data.
   * @param filename Target file.
   */
  writeFile(strings: { [id: number]: string }, filename: string) {
    const outputBuffer = this.writeBuffer(strings, path.extname(filename) !== ".STRINGS");
    fs.writeFileSync(filename, outputBuffer);
  }

}
