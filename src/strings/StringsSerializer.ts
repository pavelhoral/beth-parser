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
  serialize(strings: { [id: number]: string }) {
    const stringIds = Object.keys(strings);
    const directorySize = stringIds.length * 8;
    let dataSize: number = 0;
    // Convert all strings into buffers
    const stringMap = stringIds.reduce((result, stringId) => {
      const string: string = strings[stringId];
      if (!result[string]) {
        result[string] = Buffer.from(string, this.encoding as BufferEncoding);
        dataSize += +this.padded * 8 + result[string].length + 1;
      }
      return result;
    }, {});
    const buffer = Buffer.alloc(8 + directorySize + dataSize);
    // Write header
    buffer.writeUInt32LE(stringIds.length, 0);
    buffer.writeUInt32LE(dataSize, 4);
    // Serialize data
    Object.keys(stringMap).reduce((offset, string) => {
      const encoded = stringMap[string];
      stringMap[string] = offset;
      if (this.padded) {
        buffer.writeUInt32LE(encoded.length + 1, 8 + directorySize + offset);
        offset += 4;
      }
      encoded.copy(buffer, 8 + directorySize + offset);
      return offset + encoded.length + 1;
    }, 0);
    // Serialize dictionary
    stringIds.forEach((stringId, index) => {
      buffer.writeUInt32LE(+stringId, 8 + index * 8);
      buffer.writeUInt32LE(stringMap[strings[stringId]], 8 + index * 8 + 4);
    });
    return buffer;
  }

}
