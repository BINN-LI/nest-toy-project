import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { HttpExceptionFilter } from './common/exceptions/http-excepton.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 전역 에러 필터(exception filter)
  app.useGlobalFilters(new HttpExceptionFilter());
  // 전역 성공 인터셉터(interceptor)
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });
  // swagger
  const config = new DocumentBuilder()
    .setTitle('C.I.C')
    .setDescription('blog project')
    .setVersion('1.0.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // 전역 파이프(validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  // 포트 넘버
  await app.listen(process.env.PORT_NO);
}
bootstrap();
