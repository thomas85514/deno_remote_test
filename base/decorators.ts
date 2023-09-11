// deno-lint-ignore-file no-explicit-any
import { Codec, JsMsg, Msg } from 'https://deno.land/x/nats@v1.16.0/src/mod.ts';
import { Reflect } from 'https://deno.land/x/reflect_metadata@v0.1.12/mod.ts';

export function Controller(consumer: string) {
  return (constructor: any) => {
    Reflect.defineMetadata('consumer', consumer, constructor);
  };
}

export function Subscriber(subject: string) {
  return (
    target: any,
    propertyKey: string,
    _descriptor: TypedPropertyDescriptor<(message: JsMsg, payload: any) => any>,
  ) => {
    const subscribers = Reflect.getMetadata('subscribers', target) || [];
    subscribers.push({ subject, methodName: propertyKey });
    Reflect.defineMetadata('subscribers', subscribers, target);
  };
}

export function Replier(subject: string) {
  return (
    target: any,
    propertyKey: string,
    _descriptor: TypedPropertyDescriptor<
      (message: Msg, payload: any, jsonCodec: Codec<any>) => any
    >,
  ) => {
    const repliers = Reflect.getMetadata('repliers', target) || [];
    repliers.push({ subject, methodName: propertyKey });
    Reflect.defineMetadata('repliers', repliers, target);
  };
}
