import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CustomLogger } from 'src/core/logger/logger.service';

@Injectable()
export class UserStateService {
  constructor(private readonly logger: CustomLogger) {}

  /**
   * Centralized utility to check if a user is allowed to log in
   * @param user - The user entity to check
   * @param correlation_id - Correlation ID for logging
   * @throws UnauthorizedException if user cannot log in
   */
  assertUserLoginAllowed(user: User, correlation_id: string): void {
    this.logger.setContext(this.constructor.name + '/assertUserLoginAllowed');

    if (user.is_deleted) {
      this.logger.debug(correlation_id, 'User is deleted, login not allowed');
      throw new UnauthorizedException('User doesnot exist');
    }

    if (!user.is_active) {
      this.logger.debug(correlation_id, 'User is inactive, login not allowed');
      throw new UnauthorizedException('User is Inactive');
    }
  }

  /**
   * Check if a user can sign up with the given email
   * @param existingUser - Existing user found by email (can be null)
   * @param correlation_id - Correlation ID for logging
   * @returns Object indicating whether signup is allowed and what action to take
   */
  checkSignupAllowed(
    existingUser: User | null,
    correlation_id: string,
  ): { allowed: boolean; action: 'create' | 'restore' | 'block'; user?: User } {
    this.logger.setContext(this.constructor.name + '/checkSignupAllowed');

    if (!existingUser) {
      this.logger.debug(
        correlation_id,
        'No existing user found, signup allowed',
      );
      return { allowed: true, action: 'create' };
    }

    if (existingUser.is_deleted) {
      this.logger.debug(
        correlation_id,
        'User is deleted, signup allowed with restore',
      );
      return { allowed: true, action: 'restore', user: existingUser };
    }

    this.logger.debug(
      correlation_id,
      'User exists and is not deleted, signup blocked',
    );
    return { allowed: false, action: 'block', user: existingUser };
  }

  /**
   * Restore a deleted user for signup
   * @param user - The deleted user to restore
   * @param newUserData - New user data to update
   * @returns Updated user entity
   */
  restoreDeletedUser(user: User, newUserData: Partial<User>): User {
    this.logger.setContext(this.constructor.name + '/restoreDeletedUser');

    // Reset user state for fresh signup
    user.is_deleted = false;
    user.is_active = true;
    user.email_verified = false;

    // Update with new data
    Object.assign(user, newUserData);

    this.logger.debug('', 'User restored for fresh signup');
    return user;
  }
}
