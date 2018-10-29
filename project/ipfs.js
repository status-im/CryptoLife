"use strict";

const IpfsApi = require("ipfs-api");
const Unixfs = require("ipfs-unixfs");
const CID = require("cids");
const { util: dagPBUtil } = require("ipld-dag-pb");
const { util: dagCBORUtil } = require("ipld-dag-cbor");

const deserializers = {
  "dag-cbor": dagCBORUtil.deserialize,
  "dag-pb": dagPBUtil.deserialize
};

const ipfs = new IpfsApi({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

const ipfsFetch = cid => {
  return new Promise((resolve, reject) => {
    ipfs.block.get(cid, (err, block) => {
      if (err) {
        return reject(err);
      }
      const codec = new CID(cid).codec;
      const deserialize = deserializers[codec];
      if (!deserialize) {
        return reject(`Unknown codec ${codec}`);
      }
      deserialize(block.data, async (err, dagNode) => {
        if (err) {
          return reject(err);
        }

        if (dagNode.cid.toBaseEncodedString() !== cid) {
          console.log(`${cid} != ${computedCid}`);
          return reject("hash does not match");
        }

        Promise.all(
          dagNode.links.map(link => ipfsFetch(link.cid.toBaseEncodedString()))
        ).then(blocks => {
          resolve(blocks.join(""));
        });

        const data = Unixfs.unmarshal(dagNode.data).data;
        if (data) {
          resolve(data.toString("utf8"));
        }
      });
    });
  });
};

module.exports = ipfsFetch;
