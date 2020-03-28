/**
 * Render form identifier as fixed width hex string.
 * @param formId Form identifier.
 */
export default function renderFormId(formId: number): string {
  const hexId = (formId | 0).toString(16).toUpperCase();
  return "00000000".substring(0, 8 - hexId.length) + hexId;
};
