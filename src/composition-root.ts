import { Container } from 'inversify';

import { AuthTokenAdapter, EmailRegistrationAdapter } from './auth/adapters';
import { AuthService } from './auth/application';
import { AuthController } from './auth/controller';
import { BlogsService } from './blogs/application';
import { BlogsController } from './blogs/controller';
import { BlogsQueryRepository, BlogsRepository } from './blogs/repository';
import { CommentsService } from './comments/application';
import { CommentsController } from './comments/controller';
import { CommentsQueryRepository, CommentsRepository } from './comments/repository';
import { EmailAdapter, JWTAdapter, PasswordHashAdapter } from './core/adapters';
import { LikesRepository } from './likes/repository';
import { PostsService } from './posts/application';
import { PostsController } from './posts/controller';
import { PostsQueryRepository, PostsRepository } from './posts/repository';
import { UserDeviceSessionsService } from './sessions/application';
import { UserDeviceSessionsController } from './sessions/controller';
import {
  UserDeviceSessionsQueryRepository,
  UserDeviceSessionsRepository,
} from './sessions/repository';
import { UsersService } from './users/application';
import { UsersController } from './users/controller';
import { UsersQueryRepository, UsersRepository } from './users/repository';

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
