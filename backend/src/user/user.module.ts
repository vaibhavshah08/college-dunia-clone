import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Document } from './documents.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UserStateService } from 'src/auth/user-state.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Document]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'CHANGE_ME_DEV',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
  ],
  providers: [UserService, UserStateService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
