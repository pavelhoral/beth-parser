import "jasmine";
import StringsParser from "../../src/strings/StringsParser";

describe("StringsParser", () => {

  it("parses strings", () => {
    const buffer = Buffer.from(
        "0200000008000000" +
        "0100000000000000" +
        "0200000004000000" +
        "464F4F00" +
        "42415200", "hex");
    const parser = new StringsParser(buffer);
    const parsed = {};
    parser.parse((id, text) => parsed[id] = text);
    expect(parsed).toEqual({ 1: "FOO", 2: "BAR" });
  });

});
