/**
 * Various modfile constants and structures as defined in https://en.uesp.net/wiki/Tes5Mod:Mod_File_Format.
 * Only for constants that are universally important or of use byt the parser library.
 * @packageDocumentation
 */

/**
 * Well known GRUP record types.
 */
export enum GroupType {

  ROOT = -1,
  TOP = 0,
  WORLD_CHILDREN = 1,
  INTERIOR_CELL_BLOCK = 2,
  INTERIOR_CELL_SUBBLOCK = 3,
  EXTERIOR_CELL_BLOCK = 4,
  EXTERIOR_CELL_SUBBLOCK = 5,
  CELL_CHILDREN = 6,
  TOPIC_CHILDREN = 7,
  CELL_PERSISTENT_CHILDREN = 8,
  CELL_TEMPORARY_CHILDREN = 9,

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
