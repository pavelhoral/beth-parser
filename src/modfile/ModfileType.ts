/**
 * Modfile entry type constant pool.
 * Contains type names mapped to their UINT32LE equivalents and vice-versa.
 */
export default class ModfileType {

  constructor(types: string[]) {
    types.forEach((type) => {
      const encoded = ModfileType.encode(type);
      this[type] = encoded;
      this[encoded] = type;
    });
    Object.freeze(this);
  }

  /**
   * Build constant pool for the given types suitable for destructuring assignments.
   * @param types List of types to be created.
   * @returns Object with types mapped to their numerical representation.
   */
  static build(...types: string[]): any {
    return types.reduce((pool, type) => {
      pool[type] = ModfileType.encode(type);
      return pool;
    }, {})
  }

  /**
   * Encode type name to its numerical representation.
   * @param type Type name.
   */
  static encode(type: string) {
    return type.charCodeAt(0) +
        (type.charCodeAt(1) << 8) +
        (type.charCodeAt(2) << 16) +
        (type.charCodeAt(3) << 24);
  }

  /**
   * Decode numerical type representation to string.
   * @param type Type number.
   */
  static decode(type: number) {
    return String.fromCharCode(
        type & 0xff,
        type >> 8 & 0xff,
        type >> 16 & 0xff,
        type >> 24 & 0xff);
  }

}