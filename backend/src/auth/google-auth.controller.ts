import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth.service';
import { Correlation } from 'src/core/correlation/correlation.decorator';
import { CustomLogger } from 'src/core/logger/logger.service';
import { customHttpError } from 'src/core/custom-error/error-service';
import {
  DATA_VALIDATION_ERROR,
  ENTITY_NOT_FOUND,
} from 'src/core/custom-error/error-constant';

export class GoogleTokenDto {
  idToken: string;
}

@ApiTags('Google OAuth')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly logger: CustomLogger,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  async googleAuth(@Req() req: Request) {
    // This will redirect to Google OAuth
    return;
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({
    status: 200,
    description: 'Google OAuth successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                user_id: { type: 'string' },
                email: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                is_admin: { type: 'boolean' },
                avatar_url: { type: 'string' },
                email_verified: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  })
  async googleAuthCallback(
    @Correlation() correlation_id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.setContext(this.constructor.name + '/googleAuthCallback');
    this.logger.debug(correlation_id, 'Processing Google OAuth callback');

    try {
      const googleProfile = req.user as any;
      const user = await this.googleAuthService.findOrCreateUser(
        correlation_id,
        googleProfile,
      );
      const tokens = await this.googleAuthService.generateTokens(
        correlation_id,
        user,
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/google/success?token=${tokens.token}`;

      this.logger.debug(correlation_id, `Redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error(correlation_id, 'Google OAuth callback failed', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      // Handle specific user state errors
      let errorType = 'oauth_failed';
      if (error.message === 'User doesnot exist') {
        errorType = 'user_not_found';
      } else if (error.message === 'User is Inactive') {
        errorType = 'user_inactive';
      }

      const redirectUrl = `${frontendUrl}/auth/google/error?error=${errorType}`;
      res.redirect(redirectUrl);
    }
  }

  @Post('verify-token')
  @ApiOperation({ summary: 'Verify Google ID token (for client-side auth)' })
  @ApiBody({ type: GoogleTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Google token verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                user_id: { type: 'string' },
                email: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                is_admin: { type: 'boolean' },
                avatar_url: { type: 'string' },
                email_verified: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Invalid Google token, user inactive, or user does not exist',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: [
            'Invalid Google token',
            'User is Inactive',
            'User doesnot exist',
          ],
          example: 'User is Inactive',
        },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async verifyGoogleToken(
    @Correlation() correlation_id: string,
    @Body() body: GoogleTokenDto,
  ) {
    this.logger.setContext(this.constructor.name + '/verifyGoogleToken');
    this.logger.debug(correlation_id, 'Verifying Google ID token from client');

    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw customHttpError(
          DATA_VALIDATION_ERROR,
          'MISSING_GOOGLE_CLIENT_ID',
          'Google Client ID not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const googleProfile = await this.googleAuthService.verifyGoogleToken(
        correlation_id,
        body.idToken,
        clientId,
      );

      // Ensure required fields are present
      if (
        !googleProfile.email ||
        !googleProfile.firstName ||
        !googleProfile.lastName
      ) {
        throw customHttpError(
          DATA_VALIDATION_ERROR,
          'INCOMPLETE_GOOGLE_PROFILE',
          'Google profile is incomplete',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create a properly typed profile object
      const typedGoogleProfile = {
        googleId: googleProfile.googleId,
        email: googleProfile.email,
        firstName: googleProfile.firstName,
        lastName: googleProfile.lastName,
        picture: googleProfile.picture,
        emailVerified: googleProfile.emailVerified || false,
      };

      const user = await this.googleAuthService.findOrCreateUser(
        correlation_id,
        typedGoogleProfile,
      );

      const tokens = await this.googleAuthService.generateTokens(
        correlation_id,
        user,
      );

      this.logger.debug(correlation_id, 'Google token verification successful');

      return {
        message: 'Google authentication successful',
        data: tokens,
      };
    } catch (error) {
      this.logger.error(
        correlation_id,
        'Google token verification failed',
        error,
      );
      throw error;
    }
  }
}
