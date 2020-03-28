import "jasmine";
import renderYamlLike from "../../src/utils/renderYamlLike";


describe("renderYamlLike", () => {

  it("renders simple object", () => {
    expect(renderYamlLike({ FOO: 1, BAR: 2 })).toEqual(
        "FOO: 1\n" +
        "BAR: 2");
  });

  it("renders simple array", () => {
    expect(renderYamlLike([ "FOO", "BAR" ])).toEqual(
        "- FOO\n" +
        "- BAR");
  });

  it("renders array with object", () => {
    expect(renderYamlLike([{ "FOO": 1, "BAR": 2 }])).toEqual(
        "- FOO: 1\n" +
        "  BAR: 2");
  });

  it("renders object with array", () => {
    expect(renderYamlLike({ "FOO": [ "BAR", "BAZ" ] })).toEqual(
        "FOO:\n" +
        "- BAR\n" +
        "- BAZ");
  });

  it("renders object with object", () => {
    expect(renderYamlLike({ "FOO": { "BAR": "BAZ" } })).toEqual(
        "FOO:\n" +
        "  BAR: BAZ");
  });

  it("renders array with array", () => {
    expect(renderYamlLike([["FOO"], ["BAR", "BAZ"]])).toEqual(
        "-\n" +
        "  - FOO\n" +
        "-\n" +
        "  - BAR\n" +
        "  - BAZ");
  });

});
