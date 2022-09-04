import { CustomDecorator } from '@main/modules/customDecorator';
import { MainApp } from '@main/modules/mainApp';
import { AppController } from './app.controller';
import { Module } from './utils/decorators';

@Module({
  imports: [MainApp, CustomDecorator],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
}
