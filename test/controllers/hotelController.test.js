const { expect } = require("chai");
const sinon = require("sinon");
const hotelController = require("../../src/controllers/hotelController");
const HotelService = require("../../src/services/hotelService");

describe("Hotel Controller", () => {
  afterEach(() => {
    sinon.restore(); // Restore stubs after each test
  });

  describe("getHotels", () => {
    it("should return all hotels if no destination or hotels query parameters are provided", async () => {
      // Stub HotelService.getAllHotels to return mock data
      const mockHotelsData = [
        { id: "iJhz", name: "Hotel 1" },
        { id: "SjyX", name: "Hotel 2" },
      ];
      sinon.stub(HotelService, "getAllHotels").resolves(mockHotelsData);

      // Mock req and res objects
      const req = { query: {} };
      const res = { json: sinon.spy() };

      // Call the function
      await hotelController.getHotels(req, res);

      // Assert the response
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(mockHotelsData);
    });

    it("should return filtered hotels by destination", async () => {
      // Stub HotelService.getAllHotels to return mock data
      const mockHotelsData = [
        { id: "iJhz", name: "Hotel 1", destination_id: 1 },
        { id: "SjyX", name: "Hotel 2", destination_id: 2 },
      ];
      sinon.stub(HotelService, "getAllHotels").resolves(mockHotelsData);

      // Mock req and res objects with destination query parameter
      const req = { query: { destination: "2" } };
      const res = { json: sinon.spy() };

      // Call the function
      await hotelController.getHotels(req, res);

      // Assert the response
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([
        { id: "SjyX", name: "Hotel 2", destination_id: 2 },
      ]);
    });

    it("should return filtered hotels by hotel IDs", async () => {
      // Stub HotelService.getAllHotels to return mock data
      const mockHotelsData = [
        { id: "iJhz", name: "Hotel 1", destination_id: 1 },
        { id: "SjyX", name: "Hotel 2", destination_id: 2 },
        { id: "f8c9", name: "Hotel 3", destination_id: 2 },
      ];
      sinon.stub(HotelService, "getAllHotels").resolves(mockHotelsData);

      // Mock req and res objects with hotels query parameter
      const req = { query: { hotels: "iJhz,SjyX" } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(), // Stub the status method to return the res object
      };

      // Call the function
      await hotelController.getHotels(req, res);

      // Assert the response
      expect(res.status.calledOnce).to.be.false; // No status should be called
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([
        { id: "iJhz", name: "Hotel 1", destination_id: 1 },
        { id: "SjyX", name: "Hotel 2", destination_id: 2 },
      ]);
    });

    it("should return filtered hotels by hotel IDs and destination", async () => {
      // Stub HotelService.getAllHotels to return mock data
      const mockHotelsData = [
        { id: "iJhz", name: "Hotel 1", destination_id: 1 },
        { id: "SjyX", name: "Hotel 2", destination_id: 2 },
        { id: "f8c9", name: "Hotel 3", destination_id: 2 },
      ];
      sinon.stub(HotelService, "getAllHotels").resolves(mockHotelsData);

      // Mock req and res objects with hotels query parameter
      const req = { query: { hotels: "iJhz,SjyX", destination: "2" } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(), // Stub the status method to return the res object
      };

      // Call the function
      await hotelController.getHotels(req, res);

      // Assert the response
      expect(res.status.calledOnce).to.be.false; // No status should be called
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([
        { id: "SjyX", name: "Hotel 2", destination_id: 2 },
      ]);
    });

    it("should handle errors by sending a 500 status response", async () => {
      // Stub HotelService.getAllHotels to throw an error
      sinon.stub(HotelService, "getAllHotels").throws("Some error");

      // Mock req and res objects
      const req = { query: {} };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(), // Stub the status method to return the res object
      };

      // Call the function
      await hotelController.getHotels(req, res);

      // Assert the response
      expect(res.status.calledOnceWithExactly(500)).to.be.true; // Expect status to be called with 500
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        error: "An error occurred while fetching hotels",
      });
    });
  });
});
