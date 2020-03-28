/**
 * Encode type tag to its numerical representation.
 * @param type String representation of the type tag.
 */
export default function encodeTypeTag(type: string): number {
  return type.charCodeAt(0) +
      (type.charCodeAt(1) << 8) +
      (type.charCodeAt(2) << 16) +
      (type.charCodeAt(3) << 24)
}
