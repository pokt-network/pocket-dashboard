import {describe, it} from "mocha";
import "chai/register-should";
import {NetworkChain} from "../../src/models/Network";

describe("Network model", () => {

  describe("getAvailableNetworkChains", () => {
    it("Expect a list of network chains", () => {

      const chains = NetworkChain.getAvailableNetworkChains();

      // eslint-disable-next-line no-undef
      should.exist(chains);

      chains.should.to.be.an("array");
      chains.length.should.to.be.greaterThan(0);
    });
  });

  describe("getNetworkChains", () => {
    it("Expect a list of network chains from hashes", () => {

      const networkHashes = [
        "0001",
        "0002"
      ];

      const chains = NetworkChain.getNetworkChains(networkHashes);

      // eslint-disable-next-line no-undef
      should.exist(chains);

      chains.should.to.be.an("array");
      chains.length.should.to.be.equal(2);
    });

    it("Expect an empty list of network chains", () => {

      const networkHashes = [];

      const chains = NetworkChain.getNetworkChains(networkHashes);

      // eslint-disable-next-line no-undef
      should.exist(chains);

      chains.length.should.to.be.equal(0);
    });
  });

});
