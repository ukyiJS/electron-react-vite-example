import { injectable } from 'tsyringe';

@injectable()
export class AppService {
  public getDelayTime(): number {
    return 2;
  }
}
