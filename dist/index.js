"use strict";

var _buildMatchSnapshot = require("./buildMatchSnapshot");

var _buildMatchSnapshot2 = _interopRequireDefault(_buildMatchSnapshot);

var _buildConfigState2 = require("./buildConfigState");

var _buildConfigState3 = _interopRequireDefault(_buildConfigState2);

var _determineConfig = require("./determineConfig");

var _determineConfig2 = _interopRequireDefault(_determineConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasChaiJestSnapshotBeenUsed = false;
var configuredSetFilename = void 0;
var configuredSetTestName = void 0;
var configuredConfigureUsingMochaContext = void 0;

function chaiJestSnapshot(chai, utils) {
  if (hasChaiJestSnapshotBeenUsed) {
    throw new Error("Running `chai.use(chaiJestSnapshot)` more than once is not supported.");
  }

  var _buildConfigState = (0, _buildConfigState3.default)(_determineConfig2.default),
      setFilename = _buildConfigState.setFilename,
      setTestName = _buildConfigState.setTestName,
      configureUsingMochaContext = _buildConfigState.configureUsingMochaContext,
      parseArgs = _buildConfigState.parseArgs;

  var matchSnapshot = (0, _buildMatchSnapshot2.default)(utils, parseArgs);
  chai.Assertion.addMethod("matchSnapshot", matchSnapshot);

  configuredSetFilename = setFilename;
  configuredSetTestName = setTestName;
  configuredConfigureUsingMochaContext = configureUsingMochaContext;

  hasChaiJestSnapshotBeenUsed = true;
};

chaiJestSnapshot.setFilename = function setFilename() {
  if (configuredSetFilename) {
    configuredSetFilename.apply(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.setFilename`.");
  }
};

chaiJestSnapshot.setTestName = function setTestName() {
  if (configuredSetTestName) {
    configuredSetTestName.apply(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.setTestName`.");
  }
};

chaiJestSnapshot.configureUsingMochaContext = function configureUsingMochaContext() {
  if (configuredConfigureUsingMochaContext) {
    configuredConfigureUsingMochaContext.apply(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.configureUsingMochaContext`.");
  }
};

module.exports = chaiJestSnapshot;