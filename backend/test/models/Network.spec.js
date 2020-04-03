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
        "a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309",
        "8ef9a7c67f6f8ad14f82c1f340963951245f912f037a7087f3f2d2f9f9ee38a8"
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
