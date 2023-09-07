import { encode } from "iconv-lite";

/**
 * Strings data serializer.
 */
export default class StringsSerializer {

  /**
   * @param strings Strings dictionary.
   * @param padded Whether to use padded format.
   * @param encoding String encoding.
   */
  constructor(
      protected padded = false,
      protected encoding = "utf-8") {
  }

  /**
   * Serialize strings into data buffer.
   */
  serialize(strings: { [id: number]: string }): Buffer {
    const ids = Object.keys(strings).map(Number);
    const directorySize = ids.length * 8;
    let dataSize = 0;
    // Create string to buffer dictionary
    const dictionary = ids.reduce((result: any, stringId: number) => {
      const text: string = strings[stringId];
      if (!result[text]) {
        result[text] = encode(text, this.encoding);
        dataSize += +this.padded * 8 + result[text].length + 1;
      }
      return result;
    }, {});
    const buffer = Buffer.alloc(8 + directorySize + dataSize);
    // Write header
    buffer.writeUInt32LE(ids.length, 0);
    buffer.writeUInt32LE(dataSize, 4);
    // Serialize data
    Object.keys(dictionary).reduce((offset, text) => {
      const encoded = dictionary[text];
      dictionary[text] = offset;
      if (this.padded) {
        buffer.writeUInt32LE(encoded.length + 1, 8 + directorySize + offset);
        offset += 4;
      }
      encoded.copy(buffer, 8 + directorySize + offset);
      return offset + encoded.length + 1;
    }, 0);
    // Serialize dictionary
    ids.forEach((id, index) => {
      buffer.writeUInt32LE(+id, 8 + index * 8);
      buffer.writeUInt32LE(dictionary[strings[id]], 8 + index * 8 + 4);
    });
    return buffer;
  }

}
