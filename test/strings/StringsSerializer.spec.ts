import "jasmine";
import StringsSerializer from "../../src/strings/StringsSerializer";

describe("StringsSerializer", () => {

  it("serializes strings", () => {
    const serializer = new StringsSerializer();
    const output = serializer.serialize({ 1: "FOO", 2: "BAR" });
    expect(output.toString("hex").toUpperCase()).toBe(
      "02000000" + // string count
      "08000000" + // string data size
      "0100000000000000" + // first string data offset
      "0200000004000000" + // second string data offset
      "464F4F00" + // fist zero terminated string
      "42415200" // second zero terminated string
    )
  });

});
