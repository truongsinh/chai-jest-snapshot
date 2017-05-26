"use strict";

module.exports = function buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry) {
  return function getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate) {
    var nextCounter = snapshotNameRegistry[snapshotNameTemplate] + 1;
    snapshotNameRegistry[snapshotNameTemplate] = nextCounter;

    return snapshotNameTemplate + " " + nextCounter;
  };
};