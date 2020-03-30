import "jasmine";
import renderUint32 from "../../src/utils/renderUint32";

describe("renderUint32", () => {

  it("renders UInt32", () => {
    expect(renderUint32(1)).toBe("00000001");
    expect(renderUint32(65535)).toBe("0000FFFF");
  });

});
