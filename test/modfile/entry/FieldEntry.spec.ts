import "jasmine";
import { encodeTypeTag } from "../../../src/utils";
import FieldEntry from "../../../src/modfile/entry/FieldEntry";

describe("FieldEntry", () => {

  it("serializes with value to JSON ", () => {
    const field = new FieldEntry(encodeTypeTag("CNAM"), Buffer.from("FOO"));
    const json = JSON.stringify(field);
    expect(json).toBe("{\"CNAM\":\"464F4F\"}");
  });

  it("serializes without value to JSON ", () => {
    const field = new FieldEntry(encodeTypeTag("CNAM"), Buffer.alloc(0));
    const json = JSON.stringify(field);
    expect(json).toBe("{\"CNAM\":\"\"}");
  });

});
