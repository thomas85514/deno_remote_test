// deno-lint-ignore-file no-explicit-any
// import { OrderService } from '@his/model/order-service/mod.ts';
import { Controller, Subscriber, Replier } from 'https://raw.githubusercontent.com/thomas85514/deno_remote_test/main/controller/mod.ts';
import { JsMsg, Msg, Codec } from 'https://deno.land/x/nats@v1.16.0/src/mod.ts';

@Controller('order')
export class OrderController {
  constructor() // private readonly orderService: OrderService = new OrderService(),
  {}

  @Subscriber('insert')
  async insertOrder(message: JsMsg, payload: any) {
    try {
      console.log('Processing insertOrder: ', payload);
      // await this.orderService.insertOrder();

      message.ack();
    } catch (error) {
      console.error('Error while getOrders: ', error);
      message.nak();
    }
  }

  @Replier('list')
  async getOrders(message: Msg, payload: any, jsonCodec: Codec<any>) {
    console.log('Processing getOrders: ', payload);
    // const orders = await this.orderService.getAllOrders();

    message.respond(jsonCodec.encode([]));
  }
}
