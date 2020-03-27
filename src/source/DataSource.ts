/**
 * Sequential data source.
 */
export default interface DataSource {

  /**
   * Read the defined number of bytes as a buffer.
   */
  read(length: number): Buffer;

  /**
   * Skip the defined number of bytes.
   */
  skip(length: number);

  /**
   * Close the underlying data source.
   */
  close();

}
