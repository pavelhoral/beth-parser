import * as fs from "fs";
import * as path from "path";

import StringsParser from "./StringsParser";

/**
 * Node.js based strings file reader.
 */
export default class StringsReader {

  private strings: { [id: number]: string } = {};

  /**
   * Read strings from the given data buffer.
   * @param buffer Buffer with strings data.
   * @param padded Whether strings are stored with size padding.
   * @param encoding String encoding.
   */
  readBuffer(buffer: Buffer, padded = false, encoding = "utf-8") {
    const stringsParser = new StringsParser(buffer, padded, encoding);
    stringsParser.parse((id, text) => this.strings[id] = text);
    return this.strings;
  }

  /**
   * Read strings from the specified file.
   * @param filename File system path to a strings file.
   * @param encoding String encoding.
   */
  readFile(filename: string, encoding = "utf-8") {
    const buffer = fs.readFileSync(filename);
    const padded = path.extname(filename).toUpperCase() !== ".STRINGS";
    return this.readBuffer(buffer, padded, encoding);
  }

  /**
   * Read strings for the specified modfile.
   * @param filename File system path to a modfile.
   * @param language Strings file language code.
   * @param encoding String encoding.
   */
  readByModfile(filename: string, language: string, encoding = "utf-8") {
    const basename = path.basename(filename).replace(/\.[^\.]+$/, "") + "_" + language;
    const dirname = path.join(path.dirname(filename), "Strings");
    [".STRINGS", ".DLSTRINGS", ".ILSTRINGS"].forEach((extension) => {
      this.readFile(path.join(dirname, basename + extension), encoding);
    });
    return this.strings;
  }

}
