import * as zlib from "zlib";

import { RecordFlag } from './ModfileDefs';
import DataSource from "../source/DataSource";
import ModfileType from "./ModfileType";
import ModfileHandler, { ModfileHeader, ParseChildren } from "./ModfileHandler";

/**
 * Basic types used by the parser.
 */
const {
  TES4, CNAM, SNAM, MAST, GRUP, OFST, XXXX
} = ModfileType.build(
  "TES4", "GRUP", "CNAM", "SNAM", "MAST", "OFST", "XXXX"
);

/**
 * TES4 record mapper.
 */
class HeaderMapper extends ModfileHandler {

  header: ModfileHeader = {
    author: null,
    description: null,
    parents: []
  };

  handleRecord(type: number, _size, _flags, _formId, parse: ParseChildren) {
    if (type !== TES4) {
      throw new Error(`Invalid header type ${type}.`);
    }
    parse(this);
  }

  handleField(type: number, size: number, buffer: Buffer, offset: number) {
    if (type === CNAM) {
      this.header.author = buffer.toString("ascii", offset, offset + size - 1);
    } else if (type === SNAM) {
      this.header.description = buffer.toString("ascii", offset, offset + size - 1);
    } else if (type === MAST) {
      this.header.parents.push(buffer.toString("ascii", offset, offset + size - 1));
    }
  }

}

/**
 * Simple parser for Bethesda's ESM/ESP modfiles.
 * Parser reads provided data source and processes entries via provided entry handler.
 */
export default class ModfileParser {

  constructor(private source: DataSource) {
    Object.freeze(this);
  }

  /**
   * Start modfile parsing with the given handler.
   * @param handler Top-level modfile handler.
   */
  parse(handler: ModfileHandler) {
    this.parseHeader(handler);
    while (this.parseNext(handler)) { /* no-op */ }
  }

  /**
   * Parse next entry and return its size in bytes.
   * @param handler Current modfile handler.
   * @param assert Whether to signal error when there is no content.
   * @returns Number of processed bytes or zero for EOF.
   */
  private parseNext(handler, assert = false): number {
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
   * Parse modfile header field.
   * @param handler Modfile handler.
   */
  private parseHeader(handler: ModfileHandler): void {
    const mapper = new HeaderMapper();
    this.parseNext(mapper, true);
    handler.handleHeader(mapper.header);
  }

  /**
   * Parse group based entry and return its size (including header).
   * @param buffer Buffer with group header.
   * @param handler Modfile handler to use.
   */
  private parseGroup(buffer: Buffer, handler: ModfileHandler): number {
    const size = buffer.readUInt32LE(4);
    const label = buffer.readUInt32LE(8);
    const type = buffer.readInt32LE(12);
    let skip = size - 24;
    handler.handleGroup(type, label, (handler) => {
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
  private parseRecord(type: number, buffer: Buffer, handler: ModfileHandler): number {
    const size = buffer.readUInt32LE(4);
    const flags = buffer.readUInt32LE(8);
    const formId = buffer.readUInt32LE(12);
    let skip = size;
    handler.handleRecord(type, size, flags, formId, (handler) => {
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
  private parseFields(buffer: Buffer, handler: ModfileHandler): number {
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
  private parseField(buffer: Buffer, offset: number, size: number, handler: ModfileHandler): number {
    const type = buffer.readUInt32LE(offset);
    if (type === OFST) {
      return buffer.length - offset;
    } else if (type === XXXX) {
      return size + 6 + this.parseField(buffer, offset + 16, buffer.readUInt32LE(offset + 6), handler);
    }
    handler.handleField(type, size, buffer, offset + 6);
    return size + 6;
  }

}
