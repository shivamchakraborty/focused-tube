export const web3LoginMessage = (nonce: string): string => {
  return [
    `Signing this message logs you in to this application using your wallet address`,
    `Nonce: ${nonce}`,
  ].join("\n");
};
