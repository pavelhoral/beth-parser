import "jasmine";
import renderYamlLike from "../../src/utils/renderYamlLike";


describe("renderYamlLike", () => {

  it("renders simple object", () => {
    expect(renderYamlLike({ FOO: 1, BAR: 2 })).toBe(
        "FOO: 1\n" +
        "BAR: 2");
  });

  it("renders simple array", () => {
    expect(renderYamlLike([ "FOO", "BAR" ])).toBe(
        "- FOO\n" +
        "- BAR");
  });

  it("renders array with object", () => {
    expect(renderYamlLike([{ "FOO": 1, "BAR": 2 }])).toBe(
        "- FOO: 1\n" +
        "  BAR: 2");
  });

  it("renders object with array", () => {
    expect(renderYamlLike({ "FOO": [ "BAR", "BAZ" ] })).toBe(
        "FOO:\n" +
        "- BAR\n" +
        "- BAZ");
  });

  it("renders object with empty array", () => {
    expect(renderYamlLike({ "FOO": [] })).toBe("FOO:");
  });

  it("renders buffer as hex string", () => {
    expect(renderYamlLike(Buffer.from("01020304", "hex"))).toBe("[01020304]");
  });

  it("renders object with object", () => {
    expect(renderYamlLike({ "FOO": { "BAR": "BAZ" } })).toBe(
        "FOO:\n" +
        "  BAR: BAZ");
  });

  it("renders array with array", () => {
    expect(renderYamlLike([["FOO"], ["BAR", "BAZ"]])).toBe(
        "-\n" +
        "  - FOO\n" +
        "-\n" +
        "  - BAR\n" +
        "  - BAZ");
  });

});
