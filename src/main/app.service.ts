import { Injectable } from './utils/decorators';

@Injectable()
export class AppService {
  public getDelayTime(): number {
    return 2;
  }
}
