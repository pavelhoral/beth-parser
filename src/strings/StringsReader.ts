
import { readFileSync } from "fs";
import StringsParser from "./StringsParser";
import { basename, dirname, extname, join } from "path";


export type Dictionary = { [id: number]: string };

/**
 * Node.js based strings file reader (high-level API for parser).
 */
export default class StringsReader {

  private strings: Dictionary = {};

  /**
   * Read strings from the given data buffer.
   * @param buffer Buffer with strings data.
   * @param padded Whether strings are stored with size padding.
   * @param encoding String encoding.
   */
  readBuffer(buffer: Buffer, padded = false, encoding = "utf-8"): Dictionary {
    const stringsParser = new StringsParser(buffer, padded, encoding);
    stringsParser.parse((id, text) => this.strings[id] = text);
    return this.strings;
  }

  /**
   * Read strings from the specified file.
   * @param filename File system path to a strings file.
   * @param encoding String encoding.
   */
  readFile(filename: string, encoding = "utf-8"): Dictionary {
    const buffer = readFileSync(filename);
    const padded = extname(filename).toUpperCase() !== ".STRINGS";
    return this.readBuffer(buffer, padded, encoding);
  }

  /**
   * Read strings for the specified modfile.
   * @param filename File system path to a modfile.
   * @param language Strings file language code.
   * @param encoding String encoding.
   */
  readByModfile(filename: string, language: string, encoding = "utf-8"): Dictionary {
    const name = basename(filename).replace(/\.[^\.]+$/, "") + "_" + language;
    const path = join(dirname(filename), "Strings");
    [".STRINGS", ".DLSTRINGS", ".ILSTRINGS"].forEach((extension) => {
      this.readFile(join(path, name + extension), encoding);
    });
    return this.strings;
  }

}
