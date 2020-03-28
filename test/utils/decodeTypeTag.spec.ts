import "jasmine";
import decodeTypeTag from "../../src/utils/decodeTypeTag";

describe("decodeTypeTag", () => {

  it("decodes type tag", () => {
    const type = Buffer.from("54455334", "hex").readUInt32LE(0);
    expect(decodeTypeTag(type)).toBe("TES4");
  });

});
