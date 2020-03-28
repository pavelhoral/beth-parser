import "jasmine";
import * as path from "path";
import FileSource from "../../../src/source/FileSource";
import { ModfileParser, ModfileHandler } from "../../../src/modfile/parser";
import { renderYamlLike } from "../../../src/utils";

describe("ModfileParser", () => {

  it("parses npc", () => {
    const source = new FileSource(path.join(__dirname, "JohnDoe.esp"));
    const parser = new ModfileParser(source);
    const handler = new ModfileHandler();
    parser.parse(handler);
    const john = handler.root[1]["GRUP[NPC_]"][0]["NPC_[01000F99]"];
    expect(john[0]).toEqual({ EDID: "JohnDoe" });
  });

});
