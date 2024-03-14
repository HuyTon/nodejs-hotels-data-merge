const { expect } = require("chai");
const sinon = require("sinon");
const hotelController = require("../../src/controllers/hotelController");
const HotelService = require("../../src/services/hotelService");

describe("Hotel Controller", () => {
  afterEach(() => {
    sinon.restore(); // Restore stubs after each test
  });

  // A spy in Sinon is a function that records information about its calls, such as arguments, return values, the value of this,
  // and exceptions thrown (if any). This allows us to track how the function is used during tests and make assertions based on that usage.
  // After using the spy, we can make assertions to verify how it was called. Sinon provides various assertion methods like called, calledOnce, calledWith.
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
      // - res.json.calledOnce: This part suggests that we're using a spy (res.json) created
      //   with Sinon to track how many times the json method of the res object has been called.
      // - .to.be.true: This part asserts that the condition res.json.calledOnce should evaluate to true.
      //   In other words, it checks if the json method of the res object has been called exactly once during the test.
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
