import "jasmine";
import encodeTypeTag from "../../src/utils/encodeTypeTag";

describe("encodeTypeTag", () => {

  it("encodes type tag", () => {
    const type = Buffer.from("54455334", "hex").readUInt32LE(0);
    expect(encodeTypeTag("TES4")).toBe(type);
  });

});
