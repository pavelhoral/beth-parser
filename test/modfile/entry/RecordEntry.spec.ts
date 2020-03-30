import "jasmine";
import { encodeTypeTag, renderYamlLike } from "../../../src/utils";
import RecordEntry from "../../../src/modfile/entry/RecordEntry";
import { FieldEntry } from "../../../src/modfile/entry";
import * as utils from "util";

describe("RecordEntry", () => {

  it("serializes with fields to JSON ", () => {
    const record = new RecordEntry(encodeTypeTag("NPC_"), 0, 42);
    record.fields.push(new FieldEntry(encodeTypeTag("EDID"), Buffer.from("HELLO")));
    expect(JSON.parse(JSON.stringify(record))).toEqual({
      type: "NPC_",
      flags: "00000000",
      formId: "0000002A",
      fields: [
        {
          EDID: "48454C4C4F"
        }
      ]
    });
  });

  it("serializes without fields to JSON ", () => {
    const record = new RecordEntry(encodeTypeTag("NPC_"), 0, 42);
    const json = JSON.stringify(record);
    expect(json).toBe("{\"type\":\"NPC_\",\"flags\":\"00000000\",\"formId\":\"0000002A\"}");
  });

});
