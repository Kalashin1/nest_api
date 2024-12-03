import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { AppDataSource } from './data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  AppDataSource.initialize()
    .then(async () => {
      console.log('connected to the database');
      await app.listen(3000);
    })
    .catch((error) => console.log(error));
}
bootstrap();
