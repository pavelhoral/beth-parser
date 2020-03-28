import "jasmine";
import renderFormId from "../../src/utils/renderFormId";

describe("renderFormId", () => {

  it("renders form id", () => {
    expect(renderFormId(1)).toBe("00000001");
    expect(renderFormId(65535)).toBe("0000FFFF");
  });

});
