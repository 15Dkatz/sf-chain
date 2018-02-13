const SHA256 = require('crypto-js/sha256');
const uuidV1 = require('uuid/v1');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static keyFromPrivate(keyPair) {
    return ec.keyFromPrivate(keyPair.getPrivate(), 'hex');
  }

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }

  static signHash(keyPair, messageHash) {
    const signature = keyPair.sign(messageHash);
    return signature;
  }

  static verifySignature(publicKey, signature, messageHash) {
    const key = ec.keyFromPublic(publicKey, 'hex');
    const verified = key.verify(messageHash, signature);
    return verified;
  }

  static id() {
    return uuidV1();
  }
}

module.exports = ChainUtil;