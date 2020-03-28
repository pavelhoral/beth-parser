import "jasmine";
import * as path from "path";
import { FileSource } from "../../src/source";
import { ModfileParser, DefaultModfileHandler } from "../../src/modfile";

describe("ModfileParser", () => {

  it("parses npc", () => {
    const source = new FileSource(path.join(__dirname, "JohnDoe.esp"));
    const parser = new ModfileParser(source);
    const handler = new DefaultModfileHandler();
    parser.parse(handler);
    const root = handler.root;
    // Check modfile header
    expect(root[0].author).toBe("DEFAULT");
    expect(root[0].parents[0]).toBe("Fallout4.esm");
    // Check NPC record
    const john = root[1]["GRUP[NPC_]"][0]["NPC_[01000F99]"];
    expect(john[0]).toEqual({ EDID: "JohnDoe" });
  });

});
