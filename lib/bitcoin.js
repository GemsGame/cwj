const bjs = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const bip39 = require("bip39");

const bip32 = BIP32Factory(ecc);

const generateWallets = (count, xpub) => {
  const wallets = [];

  for (let i = 0; i < count; i++) {
    const { address } = bjs.payments.p2pkh({
      pubkey: bip32.fromBase58(xpub, bjs.networks.bitcoin).derive(0).derive(i)
        .publicKey,
      network: bjs.networks.bitcoin,
    });
    wallets.push(address);
  }


  const result = {
    wallets
  }

  return result;
};


const generateMnemonic = () => {
  return bip39.generateMnemonic();
}

const generateSeed = (mnemonic) => {
  return bip39.mnemonicToSeedSync(mnemonic);
}

const generateWalletBySeed = (seed, mnemonic, count) => {
  const network = bjs.networks.bitcoin;
  const path = `m/44'/0'/0'/0`;

  let root = bip32.fromSeed(seed, network);

  let account = root.derivePath(path);

  const wallets = [];


  for (let i = 0; i < count; i++) {
    let node = account.derive(0).derive(i);

    let btcAddress = bjs.payments.p2pkh({
      pubkey: node.publicKey,
      network: network,
    }).address;


    wallets.push(
      { address: btcAddress, privateKey: node.toWIF() }
    )


  }

  const result = {
    seed: mnemonic,
    wallets
  }
  
  return result;
};

module.exports = {
  generateWallets,
  generateWalletBySeed,
  generateMnemonic,
  generateSeed,
};
