const { expect } = require("chai");
const sinon = require("sinon");
const Helper = require("../../../src/utils/helper");
const {
  selectBestHotelName,
  selectBestAddress,
  selectBestDescription,
  selectBestImageCategory,
} = require("../../../src/services/hotelService/common/dataUtilities");

describe("selectBestHotelName", () => {
  it("should return the best hotel name", () => {
    // Define sample hotel options
    const hotelOptions = ["Beach Resort", "Villa", "Luxury Hotel"];

    const bestName = selectBestHotelName(hotelOptions);
    expect(bestName).to.equal("Luxury Hotel");
  });
});

describe("selectBestAddress", () => {
  it("should return the address with a postal code if present", () => {
    const addresses = [
      "123 Main St, New York, NY 10001",
      "123 Main Street, New York, NY",
      "123 Main Street, New York",
    ];
    const bestAddress = selectBestAddress(addresses);
    expect(bestAddress).to.equal("123 Main St, New York, NY 10001");
  });

  it("should return the longest address if no postal codes are present", () => {
    const addresses = [
      "123 Main St, New York, NY",
      "456 Elm St, Los Angeles, CA",
      "789 Oak St",
    ];
    const bestAddress = selectBestAddress(addresses);
    expect(bestAddress).to.equal("456 Elm St, Los Angeles, CA");
  });

  it("should return an empty string if no addresses are provided", () => {
    const addresses = [];
    const bestAddress = selectBestAddress(addresses);
    expect(bestAddress).to.equal("");
  });
});

describe("selectBestDescription", () => {
  it("should return the best description when specific details, location information, and quality of language are present", () => {
    const descriptions = [
      "This is a beautiful resort with beachfront villas.",
      "Our resort is located near the beach and offers stunning sea views.",
      "Experience luxury and relaxation at our beachside villa.",
    ];

    const bestDescription = selectBestDescription(descriptions);

    expect(bestDescription).to.equal(
      "Our resort is located near the beach and offers stunning sea views."
    );
  });

  it("should return an empty string when no descriptions are provided", () => {
    const descriptions = [];

    const bestDescription = selectBestDescription(descriptions);

    expect(bestDescription).to.equal("");
  });

  it("should return the first description when multiple descriptions have the same score", () => {
    const descriptions = [
      "This is a beautiful resort with beachfront villas.",
      "Discover paradise at our tropical resort.",
    ];

    const bestDescription = selectBestDescription(descriptions);

    expect(bestDescription).to.equal(
      "This is a beautiful resort with beachfront villas."
    );
  });
});

describe("selectBestImageCategory", () => {
  it("should return the best image category", () => {
    // Sample input data
    const category = [
      { link: "image1", description: "Description for image1" },
      { link: "image2", description: "Description for image2" },
      { link: "image1", description: "Short description" },
      { link: "image3", description: "Longer description for image3" },
    ];

    // Expected output based on the sample input data
    const expectedBestCategory = [
      { link: "image1", description: "Description for image1" },
      { link: "image2", description: "Description for image2" },
      { link: "image3", description: "Longer description for image3" },
    ];

    const result = selectBestImageCategory(category);
    expect(result).to.deep.equal(expectedBestCategory);
  });
});
