import { Router } from 'express';

import { appRoutes } from '../../core/constants';

export const postRouter = Router();

postRouter.get(appRoutes.POSTS, () => {});
postRouter.get(appRoutes.POST_BY_ID, () => {});
postRouter.post(appRoutes.POSTS, () => {});
postRouter.put(appRoutes.POST_BY_ID, () => {});
postRouter.delete(appRoutes.POST_BY_ID, () => {});
