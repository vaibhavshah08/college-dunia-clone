import { HttpStatus, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DATA_VALIDATION_ERROR } from 'src/core/custom-error/error-constant';
import { customHttpError } from 'src/core/custom-error/error-service';
import * as crypto from 'crypto';
import { CustomLogger } from 'src/core/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@ValidatorConstraint({ name: 'IsValidPassword', async: true })
@Injectable()
export class PasswordRegexRule implements ValidatorConstraintInterface {
  private password_decryption_key: string;
  constructor(
    private readonly logger: CustomLogger,
    private readonly config: ConfigService = new ConfigService(),
  ) {}

  async validate(encrypted_password: string) {
    try {
      const valid_password_regex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%+\/'!#$^?:,(){}[\]~*&\-_.`=|;"<>\s]).{12,50}$/;

      const regex_obj = new RegExp(valid_password_regex);
      if (!regex_obj.test(encrypted_password))
        throw customHttpError(
          DATA_VALIDATION_ERROR,
          'INVALID_PASSWORD_ERROR',
          `Password must be minimum 12 characters and contain one uppercase letter, one lowercase letter, one digit and one special character`,
          HttpStatus.BAD_REQUEST,
        );
      return true;
    } catch (e) {
      // TBD: populate_correlation_id from context
      // this.logger.error(
      //   "some_correlation_id",
      //   "Failed to match password regex"
      // );
      throw customHttpError(
        DATA_VALIDATION_ERROR,
        'INVALID_PASSWORD_ERROR',
        `Password must be minimum 12 characters and contain one uppercase letter, one lowercase letter, one digit and one special character`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export const IsValidPassword = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: PasswordRegexRule,
    });
  };
};
