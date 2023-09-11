export interface ServerConfig {
  dbUrl: string;
  dbName: string;
  subjects: string[];
}

export interface SubscriberMetadata {
  subject: string;
  methodName: string;
}

export interface ReplierMetadata {
  subject: string;
  methodName: string;
}

export interface ControllerMetadata {
  consumer: string;
  subscribers: SubscriberMetadata[];
  repliers: ReplierMetadata[];
}
