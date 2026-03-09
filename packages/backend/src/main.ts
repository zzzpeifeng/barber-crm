import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('理发店会员管理系统')
    .setDescription('理发店会员管理系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`应用运行在: http://localhost:${port}`);
  console.log(`API 文档: http://localhost:${port}/api-docs`);
}

bootstrap();