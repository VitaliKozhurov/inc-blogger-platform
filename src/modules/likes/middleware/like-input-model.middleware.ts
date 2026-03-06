import { body } from 'express-validator';

import { ERROR_FIELD_MESSAGES } from '../../../core/utils';
import { LikeStatus } from '../types/like-status.types';

const LIKE_STATUS_MESSAGE = 'Incorrect like status';

const allowedLikeStatuses = Object.values(LikeStatus);

export const likeInputModelMiddleware = body('likeStatus')
  .exists()
  .withMessage(ERROR_FIELD_MESSAGES.REQUIRED('likeStatus'))
  .isIn(allowedLikeStatuses)
  .withMessage(LIKE_STATUS_MESSAGE);
