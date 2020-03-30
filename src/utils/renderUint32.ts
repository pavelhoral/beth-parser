/**
 * Render unsigned integer as fixed length hex string.
 * @param value Value to render.
 */
export default function renderUint32(value: number): string {
  const hexId = (value | 0).toString(16).toUpperCase();
  return "00000000".substring(0, 8 - hexId.length) + hexId;
};
