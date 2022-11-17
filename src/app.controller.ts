import { Controller, Get, Param} from '@nestjs/common';
import { Body, Post, Query } from '@nestjs/common/decorators';
import { ethers } from 'ethers';
import { AppService, createPaymentOrderDto, PaymentOrder2, requestPaymentOrderDto } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get('/')
    getHello(): string {
      return this.appService.getHello();
    }

    @Get('last-block')
    getLastBlock(): Promise<ethers.providers.Block> {
      return this.appService.getBlock();
    }

    @Get('block/:hash') 
    getBlock(@Param('hash') hash: string): Promise<ethers.providers.Block> {
      return this.appService.getBlock(hash);
  }

    @Get('total-supply/:address')
    getTotalSupply(@Param('address') address: string): Promise<number> {
      return this.appService.getTotalSupply(address);
    }

    @Get('allowance')
    getAllowance(
      @Query('address') address: string,
      @Query('from') from: string,
      @Query('to') to: string
    ): Promise<number> {
      return this.appService.getAllowance(address, from, to);
    }

    @Get('payment-order/:id')
    getPaymentOrder(@Param('id') id: number): PaymentOrder2 {
      return this.appService.getPaymentOrder(id);
    }

    @Post('payment-order')
    createPaymentOrder(@Body() body: createPaymentOrderDto): number {
      return this.appService.createPaymentOrder(body.value, body.secret);
    }

    @Post('request-payment')
      requestPaymentOrder(@Body() body: requestPaymentOrderDto): Promise<any> {
        return this.appService.requestPaymentOrder(body.id, body.secret, body.receiverAddress);
      }
  
  }
