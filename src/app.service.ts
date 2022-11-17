import { Injectable } from '@nestjs/common';
import { ethers } from "ethers";
import * as tokenJson from './assets/MyToken.json'
import * as dotenv from "dotenv";
dotenv.config();

export class createPaymentOrderDto {
  value: number;  
  secret: string;
}

export class requestPaymentOrderDto {
  id: number;
  secret: string;
  receiverAddress: string;
}


export class PaymentOrder {
  value: number;
  id: number;
  secret: string;
}

export interface PaymentOrder2 {
  value: number;
  id: number;
}

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  erc20ContractFactory: ethers.ContractFactory;
  paymentOrders: PaymentOrder[];

  constructor() {
    // const provider = ethers.getDefaultProvider("goerli", {
    //   alchemy: process.env.ALCHEMY_API_KEY,
    //   infura: process.env.INFURA_API_KEY,
    //   etherscan: process.env.ETHERSCAN_API_KEY,
    // });
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    // const signer = wallet.connect(provider);
    const provider = ethers.getDefaultProvider("goerli");
    const signer = ethers.Wallet.createRandom().connect(this.provider);
    this.erc20ContractFactory = new ethers.ContractFactory(tokenJson.abi, tokenJson.bytecode, signer);
    this.paymentOrders = [];
  }
  getHello(): string {
    return 'Hello World!';
  }

  getBlock(blockNumberOrTag: string = 'latest'): Promise<ethers.providers.Block> {
    return this.provider.getBlock(blockNumberOrTag);
  }

  async getTotalSupply(address: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory.attach(address).connect(this.provider);
    const totalSupply = await contractInstance.totalSupply();
    return parseFloat(ethers.utils.formatEther(totalSupply));
  }

  async getAllowance(contractAddress: string, from: string, to: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory.attach(contractAddress).connect(this.provider);
    const allowance = await contractInstance.allowance(from, to);
    return parseFloat(ethers.utils.formatEther(allowance));
  }

  getPaymentOrder(id: number) {
    const paymentOrder = this.paymentOrders[id];
    return { value: paymentOrder.value, id: paymentOrder.id}
  }

  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrders.length;
    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  async requestPaymentOrder(id: number, secret: string, receiverAddress: string) {
    const paymentOrder = this.paymentOrders[id];
    if (paymentOrder.secret !== secret) throw new Error("wrong Secret");
    const signer = ethers.Wallet.createRandom().connect(this.provider);
    const contractInstance = this.erc20ContractFactory.attach("address in your .env").connect(signer);
    const tx = await contractInstance.mint(receiverAddress, paymentOrder.value);
    return tx.wait();
  }
}
