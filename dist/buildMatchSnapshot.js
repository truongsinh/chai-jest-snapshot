"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _SnapshotFile = require("./SnapshotFile");

var _SnapshotFile2 = _interopRequireDefault(_SnapshotFile);

var _lodash = require("lodash.values");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var snapshotNameCounter = {};

var buildMatchSnapshot = function buildMatchSnapshot(utils, internalConfig) {
  var snapshotFiles = {};

  return function matchSnapshot(snapshotFileName, snapshotName, update) {
    snapshotFileName = snapshotFileName || internalConfig.snapshotFileName;
    snapshotName = snapshotName || internalConfig.snapshotName;
    if (!snapshotName) {
      var snapshotNameTemplate = internalConfig.snapshotNameTemplate;
      var nextCounter = (snapshotNameCounter[snapshotNameTemplate] || 0) + 1;
      snapshotNameCounter[snapshotNameTemplate] = nextCounter;
      snapshotName = snapshotNameTemplate + " " + nextCounter;
    }

    if (utils.flag(this, 'negate')) {
      throw new Error("`matchSnapshot` cannot be used with `.not`.");
    }

    var obj = this._obj;
    var absolutePathToSnapshot = _path2.default.resolve(snapshotFileName);
    var snapshotFile = void 0;
    if (snapshotFiles[absolutePathToSnapshot]) {
      snapshotFile = snapshotFiles[absolutePathToSnapshot];
    } else {
      snapshotFiles[absolutePathToSnapshot] = new _SnapshotFile2.default(absolutePathToSnapshot);
      snapshotFile = snapshotFiles[absolutePathToSnapshot];
    }

    if (this._publishInternalVariableForTesting) {
      this._publishInternalVariableForTesting("snapshotFile", snapshotFile);
      this._publishInternalVariableForTesting("snapshotName", snapshotName);
      this._publishInternalVariableForTesting("snapshotFileName", snapshotFileName);
    }

    var matches = void 0;
    var pass = void 0;

    if (snapshotFile.fileExists() && snapshotFile.has(snapshotName)) {
      matches = snapshotFile.matches(snapshotName, obj);
      pass = matches.pass;
    } else {
      snapshotFile.add(snapshotName, obj);
      snapshotFile.save();
      pass = true;
    }

    var shouldUpdate = update || typeof process !== "undefined" && process.env && process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL;

    if (!pass && shouldUpdate) {
      snapshotFile.add(snapshotName, obj);
      snapshotFile.save();
      pass = true;
    }

    this.assert(pass, "expected value to match snapshot " + snapshotName, "expected value to not match snapshot " + snapshotName, matches && matches.expected && matches.expected.trim(), matches && matches.actual && matches.actual.trim(), matches && true);
  };
};

exports.default = buildMatchSnapshot;