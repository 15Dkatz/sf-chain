// TODO: research EdDSA
const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');

class CryptoUtil {
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
}

module.exports = CryptoUtil;