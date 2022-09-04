import { AppService } from './app.service';
import { Inject, Injectable, IpcInvoke, IpcSend } from './utils/decorators';

@Injectable()
export class AppController {
  constructor(@Inject(AppService) private appService: AppService) {
  }

  @IpcSend('reply-msg')
  public replyMsg(msg: string) {
    return `${this.appService.getDelayTime()} seconds later, the main process replies to your message: ${msg}`;
  }

  @IpcInvoke('send-msg')
  public async handleSendMsg(msg: string): Promise<string> {
    this.replyMsg(msg);
    return `The main process received your message: ${msg}`;
  }
}
