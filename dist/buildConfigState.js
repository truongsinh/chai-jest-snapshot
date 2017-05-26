"use strict";

var _buildGetNameForSnapshotUsingTemplate = require("./buildGetNameForSnapshotUsingTemplate");

var _buildGetNameForSnapshotUsingTemplate2 = _interopRequireDefault(_buildGetNameForSnapshotUsingTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function buildConfigState(determineConfig) {
  var config = {
    snapshotFilename: void 0,
    snapshotNameTemplate: void 0,
    snapshotNameRegistry: {} };

  function setFilename(snapshotFilename) {
    config.snapshotFilename = snapshotFilename;
  }

  function setTestName(snapshotNameTemplate) {
    config.snapshotNameTemplate = snapshotNameTemplate;
    config.snapshotNameRegistry[snapshotNameTemplate] = 0;
  }

  function configureUsingMochaContext(mochaContext) {
    var currentTest = mochaContext.currentTest;

    setFilename(currentTest.file + ".snap");
    setTestName(currentTest.fullTitle());
  }

  var getNameForSnapshotUsingTemplate = (0, _buildGetNameForSnapshotUsingTemplate2.default)(config.snapshotNameRegistry);

  function parseArgs(args) {
    return determineConfig(args, config, getNameForSnapshotUsingTemplate);
  }

  return {
    setFilename: setFilename,
    setTestName: setTestName,
    configureUsingMochaContext: configureUsingMochaContext,
    parseArgs: parseArgs
  };
};