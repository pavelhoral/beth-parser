import encodeTypeTag from "./encodeTypeTag";

/**
 * Create type tag pool that can be destructured.
 * @param types String representations of the type tags.
 */
export default function defineTypeTags(...types: string[]): { [key: string]: number } {
  const pool: { [key: string]: number } = {};
  for (const type of types) {
    pool[type] = encodeTypeTag(type);
  }
  return pool;
}
