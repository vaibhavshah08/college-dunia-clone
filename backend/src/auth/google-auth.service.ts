import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CustomLogger } from 'src/core/logger/logger.service';
import { customHttpError } from 'src/core/custom-error/error-service';
import {
  DATA_VALIDATION_ERROR,
  ENTITY_NOT_FOUND,
} from 'src/core/custom-error/error-constant';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(
    @InjectRepository(User) private readonly user_repo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger,
  ) {
    this.client = new OAuth2Client();
  }

  async verifyGoogleToken(
    correlation_id: string,
    idToken: string,
    clientId: string,
  ) {
    this.logger.setContext(this.constructor.name + '/verifyGoogleToken');
    this.logger.debug(correlation_id, 'Verifying Google ID token');

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw customHttpError(
          ENTITY_NOT_FOUND,
          'INVALID_GOOGLE_TOKEN',
          'Invalid Google token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      this.logger.debug(correlation_id, 'Google token verified successfully');

      return {
        googleId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      this.logger.error(
        correlation_id,
        'Google token verification failed',
        error,
      );
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'INVALID_GOOGLE_TOKEN',
        'Invalid Google token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findOrCreateUser(
    correlation_id: string,
    googleProfile: {
      googleId: string;
      email: string;
      firstName: string;
      lastName: string;
      picture?: string;
      emailVerified: boolean;
    },
  ) {
    this.logger.setContext(this.constructor.name + '/findOrCreateUser');
    this.logger.debug(
      correlation_id,
      'Finding or creating user with Google profile',
    );

    // First, try to find user by Google ID
    let user = await this.user_repo.findOne({
      where: { google_id: googleProfile.googleId },
    });

    if (user) {
      this.logger.debug(correlation_id, 'User found by Google ID');
      return user;
    }

    // If not found by Google ID, try to find by email
    user = await this.user_repo.findOne({
      where: { email: googleProfile.email },
    });

    if (user) {
      // Link Google account to existing user
      this.logger.debug(
        correlation_id,
        'Linking Google account to existing user',
      );
      user.google_id = googleProfile.googleId;
      user.avatar_url = googleProfile.picture || '';
      user.email_verified = googleProfile.emailVerified;
      user = await this.user_repo.save(user);
      return user;
    }

    // Create new user
    this.logger.debug(correlation_id, 'Creating new user with Google profile');
    const newUser = this.user_repo.create({
      user_id: uuidv4().replace(/-/g, ''),
      first_name: googleProfile.firstName,
      last_name: googleProfile.lastName,
      email: googleProfile.email,
      phone_number: '', // Google doesn't provide phone number
      password: '', // No password for Google users
      google_id: googleProfile.googleId,
      avatar_url: googleProfile.picture,
      email_verified: googleProfile.emailVerified,
      is_admin: false,
      is_active: true,
      is_deleted: false,
    });

    user = await this.user_repo.save(newUser);
    this.logger.debug(
      correlation_id,
      `New user created with ID: ${user.user_id}`,
    );

    return user;
  }

  async generateTokens(correlation_id: string, user: User) {
    this.logger.setContext(this.constructor.name + '/generateTokens');
    this.logger.debug(correlation_id, 'Generating JWT tokens for user');

    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: user.user_id,
      email: user.email,
      is_admin: user.is_admin,
    };

    const token = await this.jwtService.signAsync(payload);
    this.logger.debug(correlation_id, 'JWT token generated successfully');

    return {
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        is_admin: user.is_admin,
        is_active: user.is_active,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
}
