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

  // Health check endpoint
  app.use('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3000;
  // Listen on 0.0.0.0 to allow external access
  await app.listen(port, '0.0.0.0');
  console.log(`应用运行在: http://0.0.0.0:${port}`);
  console.log(`API 文档: http://0.0.0.0:${port}/api-docs`);
}

bootstrap();