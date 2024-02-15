const { expect } = require("chai");
const {
  createIdMap,
  groupById,
} = require("../src/services/hotelService/groupData");

describe("createIdMap & groupData", () => {
  it("should return null if input data is empty", () => {
    const result = createIdMap([]);
    expect(result).to.be.null;
  });

  it("should return null if input data is not an array", () => {
    const result = createIdMap("invalid data");
    expect(result).to.be.null;
  });

  it("should return null if input data array is empty", () => {
    const result = createIdMap([]);
    expect(result).to.be.null;
  });

  it("should create a Map with IDs as keys and items as values", () => {
    const testData = [
      { id: 1, name: "Hotel A" },
      { Id: 2, name: "Hotel B" },
      { hotel_id: 3, name: "Hotel C" },
    ];
    const result = createIdMap(testData);
    expect(result).to.be.instanceOf(Map);
    expect(result.size).to.equal(3);
    expect(result.get(1)).to.deep.equal({ id: 1, name: "Hotel A" });
    expect(result.get(2)).to.deep.equal({ Id: 2, name: "Hotel B" });
    expect(result.get(3)).to.deep.equal({ hotel_id: 3, name: "Hotel C" });
  });

  it("should handle empty maps", () => {
    const acmeMap = new Map();
    const patagoniaMap = new Map();
    const paperfliesMap = new Map();

    const groupedData = groupById(acmeMap, patagoniaMap, paperfliesMap);

    expect(groupedData).to.deep.equal([]);
  });

  it("should group data from multiple suppliers based on matching IDs", () => {
    const acmeMap = new Map([
      [1, { id: 1, name: "Hotel A" }],
      [2, { id: 2, name: "Hotel B" }],
    ]);
    const patagoniaMap = new Map([
      [2, { id: 2, name: "Hotel B" }],
      [3, { id: 3, name: "Hotel C" }],
    ]);
    const paperfliesMap = new Map([
      [1, { id: 1, name: "Hotel A" }],
      [3, { id: 3, name: "Hotel C" }],
    ]);

    const groupedData = groupById(acmeMap, patagoniaMap, paperfliesMap);

    expect(groupedData).to.deep.equal([
      {
        acme: { id: 1, name: "Hotel A" },
        paperflies: { id: 1, name: "Hotel A" },
      },
      {
        acme: { id: 2, name: "Hotel B" },
        patagonia: { id: 2, name: "Hotel B" },
      },
      {
        patagonia: { id: 3, name: "Hotel C" },
        paperflies: { id: 3, name: "Hotel C" },
      },
    ]);
  });
});
