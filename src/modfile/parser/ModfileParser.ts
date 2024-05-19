import * as zlib from "zlib";

import { RecordFlag } from "../ModfileDefs";
import { DataSource } from "../../source";
import { defineTypeTags } from "../../utils";

/**
 * Handle group based modfile entry.
 * @param type Group type.
 * @param size Children data size.
 * @param label Group label.
 * @param parse Parse children function.
 */
export type GroupHandler = (type: number, size: number, label: number, parse: ParseChildren) => void;

/**
 * Handle record modfile entry.
 * @param type Record type.
 * @param size Data size (potentially after compression).
 * @param flags Record flags.
 * @param formId Form identifier.
 * @param parse Parse children function.
 */
export type RecordHandler = (type: number, size: number, flags: number, formId: number, parse: ParseFields) => void;

/**
 * Group children handler.
 */
export interface ChildHandler {

  /**
   * Handle group child entry.
   */
  handleGroup: GroupHandler;

  /**
   * Handle record child entry.
   */
  handleRecord: RecordHandler;

}

/**
 * Handle field based modfile entry.
 * @param type Field type.
 * @param size Data size.
 * @param buffer Data buffer.
 * @param offset Data offset within the buffer.
 */
export type FieldHandler = (type: number, size: number, buffer: Buffer, offset: number) => void;

/**
 * Parse record fields.
 * @param handler Field handler.
 */
export type ParseFields = (handler: FieldHandler) => void;

/**
 * Parse group children.
 * @param handler Group child handler.
 */
export type ParseChildren = (handler: ChildHandler) => void;

/**
 * Basic types used by the parser.
 */
const { GRUP, OFST, XXXX } = defineTypeTags("GRUP", "OFST", "XXXX");

/**
 * Simple parser for Bethesda's ESM/ESP modfiles.
 * Parser reads provided data source and processes entries via provided entry handler.
 */
export default class ModfileParser {

  constructor(private source: DataSource) {
  }

  /**
   * Start modfile parsing with the given handler.
   * @param handler Top-level modfile handler.
   */
  parse(handler: ChildHandler): void {
    while (this.parseNext(handler)) { /* no-op */ }
  }

  /**
   * Parse next entry and return its size in bytes.
   * @param handler Current modfile handler.
   * @param assert Whether to signal error when there is no content.
   * @returns Number of processed bytes or zero for EOF.
   */
  private parseNext(handler: ChildHandler, assert = false): number {
    const buffer = this.source.read(24);
    const type = buffer.length === 24 ? buffer.readUInt32LE(0) : null;
    if (assert && !type) {
      throw new Error("Unexpected end of source reached.");
    } else if (type === GRUP) {
      return this.parseGroup(buffer, handler);
    } else if (type !== null) {
      return this.parseRecord(type, buffer, handler) + 24;
    }
    return 0; // EOF
  }

  /**
   * Parse group based entry and return its size (including header).
   * @param buffer Buffer with group header.
   * @param handler Modfile handler to use.
   */
  private parseGroup(buffer: Buffer, handler: ChildHandler): number {
    const size = buffer.readUInt32LE(4);
    const label = buffer.readUInt32LE(8);
    const type = buffer.readInt32LE(12);
    let skip = size - 24;
    handler.handleGroup(type, skip, label, (handler: ChildHandler) => {
      while (skip > 0) {
        skip -= this.parseNext(handler, true);
      }
    });
    this.source.skip(skip);
    return size;
  }

  /**
   * Parse record based entry and return size of its data.
   * @param type Record type.
   * @param buffer Buffer with record header.
   * @param handler Modfile handler to use.
   * @returns Number of processed bytes.
   */
  private parseRecord(type: number, buffer: Buffer, handler: ChildHandler): number {
    const size = buffer.readUInt32LE(4);
    const flags = buffer.readUInt32LE(8);
    const formId = buffer.readUInt32LE(12);
    let skip = size;
    handler.handleRecord(type, size, flags, formId, (handler: FieldHandler) => {
      let buffer = this.source.read(size);
      if (flags & RecordFlag.ZLIB_COMPRESSED) {
        buffer = zlib.inflateSync(buffer.subarray(4));
      }
      this.parseFields(buffer, handler);
      skip = 0;
    });
    this.source.skip(skip);
    return size;
  }

  /**
   * Parse field based entries.
   * @param buffer Byffer with field header.
   * @param handler Modfile handler to use.
   * @returns Number of processed bytes.
   */
  private parseFields(buffer: Buffer, handler: FieldHandler): number {
    let offset = 0;
    while (offset < buffer.length) {
      offset += this.parseField(buffer, offset, buffer.readUInt16LE(offset + 4), handler);
    }
    return buffer.length;
  }

  /**
   * Parse field at the specified offset.
   * @param buffer Data buffer all the field data.
   * @param offset Offset of field data in the buffer.
   * @param size Size of field data.
   * @param handler Modfile handler to use.
   */
  private parseField(buffer: Buffer, offset: number, size: number, handler: FieldHandler): number {
    const type = buffer.readUInt32LE(offset);
    if (type === OFST) {
      return buffer.length - offset;
    } else if (type === XXXX) {
      return size + 6 + this.parseField(buffer, offset + 10, buffer.readUInt32LE(offset + 6), handler);
    }
    handler(type, size, buffer, offset + 6);
    return size + 6;
  }

}
