# chai-jest-snapshot

Chai assertion for [jest-snapshot](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html).
See [Jest 14.0: React Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) for background knowledge about snapshot testing.

## Installation
On the command line:
```
$ npm install --save-dev chai-jest-snapshot
```

## Usage
There are three different ways to use chai-jest-snapshot.

### Mocha Configuration Mode (Recommended for Mocha Users)
If you are using mocha as your test runner, it is recommended to use chai-jest-snapshot in "mocha configuration mode".

Note: do not use an arrow function for the `beforeEach` as these will not receive the correct `this` value provided by mocha.

In your test setup file:
```js
import chai from "chai";
import chaiJestSnapshot from "chai-jest-snapshot";

chai.use(chaiJestSnapshot);

beforeEach(function() {
  chaiJestSnapshot.configureUsingMochaContext(this);
});
```

In your spec file(s) (as an example):
```js
import React from "react";
import renderer from "react-test-renderer";
import { expect } from "chai";
import Link from "./Link";

describe("Link", function() {
  it("renders correctly", () => {
    const tree = renderer.create(
      <Link page="http://www.facebook.com">Facebook</Link>
    ).toJSON();
    expect(tree).to.matchSnapshot();
  });
});
```

This will automatically write snapshots to a file with the same name as your test file, with `.snap` added to the end.
This will also choose snapshot names based on the test name, adding a number to the end based on the number of times `matchSnapshot` was called in each test (similar to jest).

In this mode, to update a single snapshot, you can pass `true` as an argument to `matchSnapshot`:
```js
expect(tree).to.matchSnapshot(true);
```

If you want to update all snapshots without adding `true` to each one, set the environment variable `CHAI_JEST_SNAPSHOT_UPDATE_ALL` to "true":
```shell
# assuming `npm test` runs your tests:
# sh/bash/zsh
$ CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test
# fish
$ env CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test
```
This behaves similarly to running `jest -u`.

### Framework-agnostic Configuration Mode (Recommended for Non-Mocha Users)
If you are not using mocha as your test runner, it is recommended to use chai-jest-snapshot in "framework-agnostic configuration mode".

In your test setup file:
```js
import chai from "chai";
import chaiJestSnapshot from "chai-jest-snapshot";

chai.use(chaiJestSnapshot);
```

In your spec file(s) (as an example):
```js
import React from "react";
import renderer from "react-test-renderer";
import { expect } from "chai";
import Link from "./Link";

describe("Link", function() {
  beforeEach(function() {
    chaiJestSnapshot.setFilename(__filename + ".snap");
  });

  it("renders correctly", () => {
    // There may be a way to automate this in your test runner; for example,
    // getting the test name in the beforeEach callback, or using a custom
    // reporter to hook into the test lifecycle.
    chaiJestSnapshot.setTestName("Link renders correctly");

    const tree = renderer.create(
      <Link page="http://www.facebook.com">Facebook</Link>
    ).toJSON();
    expect(tree).to.matchSnapshot();
  });
});
```

This will write snapshots to the file name you specify, (in this example, a file with the same name and location as the spec file, but with `.snap` added to the end).
This will use whatever snapshot name you specify as a template, adding a number to the end based on the number of times `matchSnapshot` was called using the same file name and snapshot name (similar to what jest does).

In this mode, to update a single snapshot, you can pass `true` as an argument to `matchSnapshot`:
```js
expect(tree).to.matchSnapshot(true);
```

If you want to update all snapshots without adding `true` to each one, set the environment variable `CHAI_JEST_SNAPSHOT_UPDATE_ALL` to "true":
```shell
# assuming `npm test` runs your tests:
# sh/bash/zsh
$ CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test
# fish
$ env CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test
```
This behaves similarly to running `jest -u`.

### Manual Mode
If Mocha Configuration Mode or Framework-agnostic Configuration Mode do not satisfy your needs, you can use "manual mode".

In your test setup file:
```js
import chai from "chai";
import chaiJestSnapshot from "chai-jest-snapshot";

chai.use(chaiJestSnapshot);
```

In your spec file(s) (as an example):
```js
import React from "react";
import renderer from "react-test-renderer";
import { expect } from "chai";
import Link from "./Link";

describe("Link", function() {
  it("renders correctly", () => {
    const tree = renderer.create(
      <Link page="http://www.facebook.com">Facebook</Link>
    ).toJSON();

    let snapshotFilename = __filename + ".snap";
    let snapshotName = "Link renders correctly";
    expect(tree).to.matchSnapshot(snapshotFilename, snapshotName);
  });
});
```

This will write snapshots to the file name you specify, (in this example, a file with the same name and location as the spec file, but with `.snap` added to the end).
This will use whatever snapshot name you specify as the snapshot name. **NOTE**: unlike other modes, this mode does *not* add a number to the end of the snapshot name.

In this mode, to update a single snapshot, you can pass `true` as an extra, third argument to `matchSnapshot`:
```js
expect(tree).to.matchSnapshot(snapshotFilename, snapshotName, true);
```

If you want to update all snapshots without adding `true` to each one, set the environment variable `CHAI_JEST_SNAPSHOT_UPDATE_ALL` to "true":
```shell
# assuming `npm test` runs your tests:
# sh/bash/zsh
$ CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test
# fish
$ env CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test
```
This behaves similarly to running `jest -u`.

## Tips
* If you are referencing `__filename` or `__dirname` in your snapshot file names, and compile your tests using babel, you will probably want to use [babel-plugin-transform-dirname-filename](https://github.com/TooTallNate/babel-plugin-transform-dirname-filename) to ensure your snapshots end up in your source directory instead of the directory where your tests were built (ie `dist` or `build`).

## Contributing
```
$ npm install
$ npm test
```
Pull Requests and Issues welcome
