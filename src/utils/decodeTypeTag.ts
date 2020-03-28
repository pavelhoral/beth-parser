/**
 * Decode numerical type representation to string.
 * @param type Numerical representation of the type tag.
 */
export default function decodeTypeTag(type: number): string {
  return String.fromCharCode(
      type & 0xff,
      type >> 8 & 0xff,
      type >> 16 & 0xff,
      type >> 24 & 0xff);
}
