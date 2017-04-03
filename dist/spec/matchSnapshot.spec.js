"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _ReactTestRenderer = require("react/lib/ReactTestRenderer");

var _ReactTestRenderer2 = _interopRequireDefault(_ReactTestRenderer);

var _chai = require("chai");

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _SnapshotFile = require("../SnapshotFile");

var _SnapshotFile2 = _interopRequireDefault(_SnapshotFile);

var _buildMatchSnapshot = require("../buildMatchSnapshot");

var _buildMatchSnapshot2 = _interopRequireDefault(_buildMatchSnapshot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__dirname = "/Users/truongsinhsmarp/Development/chai-jest-snapshot/src/spec";


var ExampleComponent = function ExampleComponent() {
  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(
      "h1",
      null,
      "Hi!"
    )
  );
};
var tree = _ReactTestRenderer2.default.create(_react2.default.createElement(ExampleComponent, null)).toJSON();
var prettyTree = "<div>\n  <h1>\n    Hi!\n  </h1>\n</div>";

var workspacePath = function workspacePath() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _path2.default.join.apply(_path2.default, [__dirname, "matchSnapshot.spec.workspace"].concat(args));
};

var EXISTING_SNAPSHOT_PATH = workspacePath("ExampleComponent.js.snap");
var EXISTING_SNAPSHOT_RELATIVE_PATH = "src/spec/matchSnapshot.spec.workspace/ExampleComponent.js.snap";
var EXISTING_SNAPSHOT_NAME = "ExampleComponent renders properly";
var NONEXISTANT_SNAPSHOT_PATH = workspacePath("SomeOtherComponent.js.snap");
var NONEXISTANT_SNAPSHOT_NAME = "ExampleComponent throws rubber chickens";

describe("matchSnapshot", function () {
  var object = void 0;
  var snapshotFileName = void 0;
  var snapshotName = void 0;
  var update = void 0;
  var utils = void 0;

  // Creates object with shape: { run, assert }
  // `run` will call matchSnapshot with its value of `this` stubbed appropriately
  // `assert` is a sinon.spy() that was made available to matchSnapshot as `this.assert`
  // `internal` is an object that contains any variables that were published by the match operation
  // for testing purposes.
  var createMatchOperation = function createMatchOperation(internalConfig) {
    var assert = _sinon2.default.spy();
    var internal = {};
    var timesRan = 0;
    var matchSnapshot = (0, _buildMatchSnapshot2.default)(utils, internalConfig);

    return {
      run: function run() {
        matchSnapshot.call({
          _obj: object,
          assert: assert,
          _publishInternalVariableForTesting: function _publishInternalVariableForTesting(name, value) {
            internal[name] = internal[name] || [];
            internal[name][timesRan] = value;
          }
        }, snapshotFileName, snapshotName, update);
        timesRan++;
      },

      assert: assert,
      internal: internal
    };
  };

  function expectPass() {
    var matchOperation = createMatchOperation();
    matchOperation.run();
    (0, _chai.expect)(matchOperation.assert).to.have.been.calledWith(true);
  }

  var expectFailure = function expectFailure(actual) {
    return function () {
      var matchOperation = createMatchOperation();
      matchOperation.run();
      (0, _chai.expect)(matchOperation.assert).to.have.been.calledWith(false, "expected value to match snapshot " + snapshotName, "expected value to not match snapshot " + snapshotName, prettyTree, actual, true);
    };
  };

  beforeEach(function () {
    // clear out workspace
    _rimraf2.default.sync(workspacePath("*"));
    // create the snapshot file that is considered "existing" by these tests
    var existingSnapshotFile = new _SnapshotFile2.default(EXISTING_SNAPSHOT_PATH);
    existingSnapshotFile.add(EXISTING_SNAPSHOT_NAME, tree);
    existingSnapshotFile.save();

    object = undefined;
    snapshotFileName = undefined;
    snapshotName = undefined;
    update = false;
    utils = { flag: function flag() {
        return undefined;
      } };
    delete process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL;
  });

  afterEach(function () {
    // rimraf.sync(workspacePath("*"));
  });

  var expectUsesSameInstance = function expectUsesSameInstance() {
    object = "whatever";
    var operation = createMatchOperation();
    snapshotName = "first";
    operation.run();
    snapshotName = "second";
    operation.run();
    (0, _chai.expect)(operation.internal.snapshotFile[0]).to.be.an.instanceof(_SnapshotFile2.default);
    (0, _chai.expect)(operation.internal.snapshotFile[1]).to.be.an.instanceof(_SnapshotFile2.default);
    (0, _chai.expect)(operation.internal.snapshotFile[0] === operation.internal.snapshotFile[1]).to.be.true;
  };

  describe("use #register", function () {
    it("use snapeshot file name", function () {
      object = "whatever";
      var operation = createMatchOperation({ snapshotFileName: "nameFromConfig" });
      snapshotFileName = void 0;
      operation.run();
      (0, _chai.expect)(operation.internal.snapshotFileName[0]).to.equal("nameFromConfig");
    });
  });

  describe("when the snapshot file exists", function () {
    beforeEach(function () {
      snapshotFileName = EXISTING_SNAPSHOT_PATH;
    });

    it("uses the same snapshotFile instance across multiple runs (#2)", expectUsesSameInstance);

    describe("and the snapshot file has the snapshot", function () {
      beforeEach(function () {
        snapshotName = EXISTING_SNAPSHOT_NAME;
      });

      describe("and the content matches", function () {
        beforeEach(function () {
          object = tree;
        });

        it("the assertion passes", expectPass);

        describe("and the assertion is made with `.not` in the chain", function () {
          beforeEach(function () {
            utils = { flag: function flag(_, name) {
                return name === 'negate' ? true : undefined;
              } };
          });

          it("throws an error", function () {
            (0, _chai.expect)(createMatchOperation().run).to.throw(Error, "`matchSnapshot` cannot be used with `.not`.");
          });
        });
      });

      describe("and the content does not match", function () {
        beforeEach(function () {
          object = "something other than tree";
        });

        function doesNotOverwriteSnapshot() {
          createMatchOperation().run();
          var snapshotFileContent = _fs2.default.readFileSync(snapshotFileName, 'utf8');
          var expectedContent = "exports[`" + EXISTING_SNAPSHOT_NAME + "`] = `\n" + prettyTree + "\n`;\n";
          (0, _chai.expect)(snapshotFileContent).to.equal(expectedContent);
        }

        it("does not overwrite the snapshot with the new content", doesNotOverwriteSnapshot);

        it("the assertion does not pass", expectFailure('"something other than tree"'));

        var expectOverwritesSnapshot = function expectOverwritesSnapshot() {
          createMatchOperation().run();
          var snapshotFileContent = _fs2.default.readFileSync(snapshotFileName, 'utf8');
          var expectedContent = "exports[`" + EXISTING_SNAPSHOT_NAME + "`] = `\"something other than tree\"`;\n";
          (0, _chai.expect)(snapshotFileContent).to.equal(expectedContent);
        };

        describe("and the 'update' flag set to true", function () {
          beforeEach(function () {
            update = true;
          });

          it("overwrites the snapshot with the new content", expectOverwritesSnapshot);
          it("the assertion passes", expectPass);
        });

        describe("and the 'update' flag not set to true", function () {
          beforeEach(function () {
            update = undefined;
          });

          describe("but the environment variable CHAI_JEST_SNAPSHOT_UPDATE_ALL set", function () {
            beforeEach(function () {
              process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL = "true";
            });

            it("overwrites the snapshot with the new content", expectOverwritesSnapshot);
            it("the assertion passes", expectPass);
          });
        });

        describe("and a relative path is used (#1)", function () {
          beforeEach(function () {
            snapshotFileName = EXISTING_SNAPSHOT_RELATIVE_PATH;
          });

          it("does not overwrite the snapshot with the new content", doesNotOverwriteSnapshot);

          it("the assertion does not pass", expectFailure('"something other than tree"'));
        });
      });
    });

    describe("and the snapshot file does not have the snapshot", function () {
      beforeEach(function () {
        snapshotName = NONEXISTANT_SNAPSHOT_NAME;
        object = tree;
      });

      it("adds the snapshot to the file", function () {
        createMatchOperation().run();
        var snapshotFileContent = _fs2.default.readFileSync(snapshotFileName, 'utf8');
        var expectedContent = "exports[`" + EXISTING_SNAPSHOT_NAME + "`] = `\n" + prettyTree + "\n`;\n\n" + ("exports[`" + NONEXISTANT_SNAPSHOT_NAME + "`] = `\n") + prettyTree + "\n`;\n";
        (0, _chai.expect)(snapshotFileContent).to.equal(expectedContent);
      });

      it("the assertion passes", expectPass);
    });
  });

  describe("when the snapshot file does not exist", function () {
    beforeEach(function () {
      snapshotFileName = NONEXISTANT_SNAPSHOT_PATH;
      snapshotName = NONEXISTANT_SNAPSHOT_NAME;
      object = tree;
    });

    it("uses the same snapshotFile instance across multiple runs (#2)", expectUsesSameInstance);

    it("a new snapshot file is created with the snapshot content", function () {
      createMatchOperation().run();
      var snapshotFileContent = _fs2.default.readFileSync(snapshotFileName, 'utf8');
      var expectedContent = "exports[`" + NONEXISTANT_SNAPSHOT_NAME + "`] = `\n" + prettyTree + "\n`;\n";
      (0, _chai.expect)(snapshotFileContent).to.equal(expectedContent);
    });

    it("the assertion passes", expectPass);
  });
});