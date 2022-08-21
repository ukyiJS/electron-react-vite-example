import { AppService } from '@main/app.service';
import { Controller, Inject, IpcInvoke, IpcOn } from './utils/decorators';

@Controller()
export class AppController {
  constructor(@Inject(AppService) private appService: AppService) {
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
