// TODO: research EdDSA
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

class CryptoUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static keyFromPrivate(keyPair) {
    return ec.keyFromPrivate(keyPair.getPrivate(), 'hex');
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