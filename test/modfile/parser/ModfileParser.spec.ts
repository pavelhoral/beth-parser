import "jasmine";
import * as path from "path";
import FileSource from "../../../src/source/FileSource";
import { ModfileParser, ModfileHandler } from "../../../src/modfile/parser";
import { encodeTypeTag } from "../../../src/utils";
import { RecordEntry, GroupEntry } from "../../../src/modfile/entry";

describe("ModfileParser", () => {

  it("parses npc", () => {
    const handler = new ModfileHandler();
    const source = new FileSource(path.join(__dirname, "JohnDoe.esp"));
    try {
      new ModfileParser(source).parse(handler);
    } finally {
      source.close();
    }
    const record = (handler.root.children[1] as GroupEntry).children[0] as RecordEntry;
    expect(record.type).toBe(encodeTypeTag("NPC_"));
    expect(record.fields[0].type).toBe(encodeTypeTag("EDID"));
    const name = record.fields[0].value;
    expect(name.toString("ascii", 0, name.length - 1)).toBe("JohnDoe");
  });

});
