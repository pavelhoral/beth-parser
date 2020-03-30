import "jasmine";
import * as path from "path";
import StringsReader from "../../src/strings/StringsReader";

describe("StringsReader", () => {

  it("reads strings", () => {
    const reader = new StringsReader();
    spyOn(reader, "readBuffer").and.callThrough();
    const strings = reader.readFile(path.join(__dirname, "Foobar.STRINGS"));
    expect(strings).toEqual({ 1: "FOO", 2: "BAR" });
    expect(reader.readBuffer).toHaveBeenCalledTimes(1);
  });

  it("reads strings by modfile", () => {
    const reader = new StringsReader();
    spyOn(reader, "readFile");
    reader.readByModfile("Foobar.esm", "en", "utf-8");
    expect(reader.readFile).toHaveBeenCalledTimes(3);
    expect(reader.readFile).toHaveBeenCalledWith(path.join("Strings", "Foobar_en.STRINGS"), "utf-8");
    expect(reader.readFile).toHaveBeenCalledWith(path.join("Strings", "Foobar_en.DLSTRINGS"), "utf-8");
    expect(reader.readFile).toHaveBeenCalledWith(path.join("Strings", "Foobar_en.ILSTRINGS"), "utf-8");
  });

});
