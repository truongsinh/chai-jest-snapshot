"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _lodash = require("lodash.values");

var _lodash2 = _interopRequireDefault(_lodash);

var _SnapshotFile = require("./SnapshotFile");

var _SnapshotFile2 = _interopRequireDefault(_SnapshotFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildMatchSnapshot = function buildMatchSnapshot(utils, parseArgs) {
  var snapshotFiles = {};

  function matchSnapshot() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _parseArgs = parseArgs(args),
        snapshotFilename = _parseArgs.snapshotFilename,
        snapshotName = _parseArgs.snapshotName,
        update = _parseArgs.update;

    if (utils.flag(this, 'negate')) {
      throw new Error("`matchSnapshot` cannot be used with `.not`.");
    }

    var obj = this._obj;
    var absolutePathToSnapshot = _path2.default.resolve(snapshotFilename);
    var snapshotFile = void 0;
    if (snapshotFiles[absolutePathToSnapshot]) {
      snapshotFile = snapshotFiles[absolutePathToSnapshot];
    } else {
      snapshotFiles[absolutePathToSnapshot] = new _SnapshotFile2.default(absolutePathToSnapshot);
      snapshotFile = snapshotFiles[absolutePathToSnapshot];
    }

    if (this._publishInternalVariableForTesting) {
      this._publishInternalVariableForTesting("snapshotFile", snapshotFile);
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

    if (!pass && update) {
      snapshotFile.add(snapshotName, obj);
      snapshotFile.save();
      pass = true;
    }

    this.assert(pass, "expected value to match snapshot " + snapshotName, "expected value to not match snapshot " + snapshotName, matches && matches.expected && matches.expected.trim(), matches && matches.actual && matches.actual.trim(), matches && true);
  };

  return matchSnapshot;
};

exports.default = buildMatchSnapshot;