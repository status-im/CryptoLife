"use strict";
const ipfsFetch = require("../ipfs.js");
const expect = require("chai").expect;

describe("ipfsFetch", () => {
  it("should fetch 1 small file successfully", async () => {
    const content = await ipfsFetch(
      "QmTABThaBBcEzoYpGYNjm6LHLQ1T2y8CtttzUoqJgEQxoG"
    );
    expect(content.length).to.be.eq(65135);
  });
  it("should fetch 1 big file successfully", async () => {
    const content = await ipfsFetch(
      "QmWWSDGWMc9Y5xFt5vjDnds3d6mfLsj7RYohnZdLbqxNtb"
    );
    expect(content.length).to.be.eq(265135);
  }).timeout(10000);
});
