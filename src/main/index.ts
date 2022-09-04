import 'reflect-metadata';
import { container } from 'tsyringe';
import { AppModule } from './app.module';

container.resolve(AppModule);
