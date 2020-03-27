/**
 * Strings parsing handler.
 */
export default interface StringsHandler {

  /**
   * Handle single string record.
   */
  (id: number, text: string);

}
