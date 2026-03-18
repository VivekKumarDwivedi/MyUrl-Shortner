// src/middleware/urlValidation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors/app.error';

export const validateShortUrl = (req: Request, res: Response, next: NextFunction) => {
  const { shortUrl } = req.params;

  // Check if shortUrl exists
  if (!shortUrl) {
    throw new BadRequestError('Short URL parameter is required');
  }

  // Validate format (alphanumeric only)
  const shortUrlPattern = /^[a-zA-Z0-9]+$/;
  if (!shortUrlPattern.test(shortUrl)) {
    throw new BadRequestError('Short URL must contain only alphanumeric characters');
  }

  // Validate length (1-10 characters)
  if (shortUrl.length < 1 || shortUrl.length > 10) {
    throw new BadRequestError('Short URL must be between 1 and 10 characters');
  }

  // Trim whitespace
  req.params.shortUrl = shortUrl.trim();

  next();
};
