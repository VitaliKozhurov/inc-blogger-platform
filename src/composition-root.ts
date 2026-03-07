import { Container } from 'inversify';

import { EmailAdapter, JWTAdapter, PasswordHashAdapter } from './core/adapters';
import {
  AuthController,
  AuthService,
  AuthTokenAdapter,
  EmailRegistrationAdapter,
} from './modules/auth';
import {
  BlogsController,
  BlogsQueryRepository,
  BlogsRepository,
  BlogsService,
} from './modules/blogs';
import {
  CommentsController,
  CommentsQueryRepository,
  CommentsRepository,
  CommentsService,
} from './modules/comments';
import { LikesRepository } from './modules/likes';
import {
  PostsController,
  PostsQueryRepository,
  PostsRepository,
  PostsService,
} from './modules/posts';
import {
  UserDeviceSessionsController,
  UserDeviceSessionsQueryRepository,
  UserDeviceSessionsRepository,
  UserDeviceSessionsService,
} from './modules/user-device-session';
import {
  UsersController,
  UsersQueryRepository,
  UsersRepository,
  UsersService,
} from './modules/users';

export const iocContainer = new Container();

// adapters
iocContainer.bind(EmailAdapter).toSelf().inSingletonScope();
iocContainer.bind(JWTAdapter).toSelf().inSingletonScope();
iocContainer.bind(PasswordHashAdapter).toSelf().inSingletonScope();

// auth
iocContainer.bind(AuthTokenAdapter).toSelf().inSingletonScope();
iocContainer.bind(EmailRegistrationAdapter).toSelf().inSingletonScope();
iocContainer.bind(AuthService).toSelf().inSingletonScope();
iocContainer.bind(AuthController).toSelf().inSingletonScope();

// sessions
iocContainer.bind(UserDeviceSessionsRepository).toSelf().inSingletonScope();
iocContainer.bind(UserDeviceSessionsQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(UserDeviceSessionsService).toSelf().inSingletonScope();
iocContainer.bind(UserDeviceSessionsController).toSelf().inSingletonScope();

// users
iocContainer.bind(UsersRepository).toSelf().inSingletonScope();
iocContainer.bind(UsersQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(UsersService).toSelf().inSingletonScope();
iocContainer.bind(UsersController).toSelf().inSingletonScope();

// blogs
iocContainer.bind(BlogsRepository).toSelf().inSingletonScope();
iocContainer.bind(BlogsQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(BlogsService).toSelf().inSingletonScope();
iocContainer.bind(BlogsController).toSelf().inSingletonScope();

//posts
iocContainer.bind(PostsRepository).toSelf().inSingletonScope();
iocContainer.bind(PostsQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(PostsService).toSelf().inSingletonScope();
iocContainer.bind(PostsController).toSelf().inSingletonScope();

// comments
iocContainer.bind(CommentsRepository).toSelf().inSingletonScope();
iocContainer.bind(CommentsQueryRepository).toSelf().inSingletonScope();
iocContainer.bind(CommentsService).toSelf().inSingletonScope();
iocContainer.bind(CommentsController).toSelf().inSingletonScope();

// likes
iocContainer.bind(LikesRepository).toSelf().inSingletonScope();
