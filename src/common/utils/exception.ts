import { BadRequestException } from '@nestjs/common';
import { ErrorCode } from '../constants/error';
import { ValidationError } from 'class-validator';

interface ErrorMessage {
  property: string;
  errors: ErrorMessage[] | string;
}

const handleNestedError = (error: ValidationError): ErrorMessage => {
  const property = error.property;
  let nestedErrors: ErrorMessage[] | undefined;

  if (error.children && error.children.length) {
    nestedErrors = error.children.map(handleNestedError);
  }

  const message = error.constraints?.[Object.keys(error.constraints)?.[0]];

  return {
    property: property,
    errors: nestedErrors || message,
  };
};

export const formatExceptionFactory = (errors: ValidationError[]) => {
  const errorMessages = errors.map((error: ValidationError): ErrorMessage => {
    const property = error.property;
    let nestedErrors: ErrorMessage[] | undefined;

    // Handle nested errors recursively
    if (error.children && error.children.length) {
      nestedErrors = error.children.map(handleNestedError);
    }

    // Handle single constraint violation
    const message = error.constraints?.[Object.keys(error.constraints)?.[0]];

    return {
      property,
      errors: nestedErrors || message,
    };
  });

  return new BadRequestException({
    errorCode: ErrorCode.VALIDATION_ERROR,
    errorMessage: errorMessages,
  });
};
