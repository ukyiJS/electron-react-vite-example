import { AppService } from '@main/app.service';
import { inject, singleton } from 'tsyringe';
import { IpcInvoke, IpcOn } from './utils/decorators';

@singleton()
export class AppController {
  constructor(@inject(AppService) private appService: AppService) {
  }

  @IpcOn('reply-msg')
  public replyMsg(msg: string) {
    return `${this.appService.getDelayTime()} seconds later, the main process replies to your message: ${msg}`;
  }

  @IpcInvoke('send-msg')
  public async handleSendMsg(msg: string): Promise<string> {
    setTimeout(() => this.replyMsg(msg), this.appService.getDelayTime() * 1000);
    return `The main process received your message: ${msg}`;
  }
}
