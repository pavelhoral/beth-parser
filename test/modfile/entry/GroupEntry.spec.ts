import "jasmine";
import GroupEntry from "../../../src/modfile/entry/GroupEntry";
import { GroupType } from "../../../src/modfile/ModfileDefs";
import { encodeTypeTag } from "../../../src/utils";

describe("GroupEntry", () => {

  it("serializes TOP to JSON ", () => {
    const group = new GroupEntry(GroupType.TOP, encodeTypeTag("TES4"));
    const json = JSON.stringify(group);
    expect(json).toBe("{\"type\":\"TOP\",\"label\":\"TES4\"}");
  });

});
