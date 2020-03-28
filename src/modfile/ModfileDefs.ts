/**
 * Various modfile constants and structures as defined in https://en.uesp.net/wiki/Tes5Mod:Mod_File_Format.
 * Only for constants that are universally important or of use byt the parser library.
 * @packageDocumentation
 */

/**
 * Well known GRUP record types.
 */
export enum GroupType {

  TOP = 0

};

/**
 * Well known and used record flags.
 */
export enum RecordFlag {

  /**
   * Record data is compressed with ZLIB.
   */
  ZLIB_COMPRESSED = 0x00040000

}
