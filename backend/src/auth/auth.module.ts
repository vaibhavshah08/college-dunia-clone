import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    LoggerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'CHANGE_ME_DEV',
        signOptions: { expiresIn: '5d' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [GoogleAuthController],
  providers: [JwtStrategy, GoogleStrategy, GoogleAuthService],
  exports: [JwtModule, PassportModule, GoogleAuthService],
})
export class AuthModule {}
