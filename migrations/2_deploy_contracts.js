const LegitHub = artifacts.require("LegitHub");

module.exports = function(deployer) {
  deployer.deploy(LegitHub);
};
