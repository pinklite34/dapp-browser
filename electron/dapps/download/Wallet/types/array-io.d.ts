declare module 'array-io';

export as namespace ArrayIO;

export class Keychain {
  constructor();
  sign(transaction: string): Promise<any>;
  publicKey(): Promise<any>;
}

export class Ethereum {
  constructor();
  buildTransaction(signature: string, from:string, to: string, value: number): Promise<any>;
  publishTransaction(transaction: string): Promise<any>;
}
