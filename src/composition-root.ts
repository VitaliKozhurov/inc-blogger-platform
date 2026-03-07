import { Container } from 'inversify';

import { EmailAdapter, JWTAdapter, PasswordHashAdapter } from './core/adapters';
import { AuthTokenAdapter } from './modules/auth/adapters/auth-token.adapter';
import { EmailRegistrationAdapter } from './modules/auth/adapters/email-registration.adapter';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { BlogsQueryRepository } from './modules/blogs/blogs-query.repository';
import { BlogsController } from './modules/blogs/blogs.controller';
import { BlogsRepository } from './modules/blogs/blogs.repository';
import { BlogsService } from './modules/blogs/blogs.service';
import { CommentsQueryRepository } from './modules/comments/comments-query.repository';
import { CommentsController } from './modules/comments/comments.controller';
import { CommentsRepository } from './modules/comments/comments.repository';
import { CommentsService } from './modules/comments/comments.service';
import { LikesRepository } from './modules/likes/likes.repository';
import { PostsQueryRepository } from './modules/posts/posts-query.repository';
import { PostsController } from './modules/posts/posts.controller';
import { PostsRepository } from './modules/posts/posts.repository';
import { PostsService } from './modules/posts/posts.service';
import { UserDeviceSessionsService } from './modules/user-device-session/user-device-session.service';
import { UserDeviceSessionsQueryRepository } from './modules/user-device-session/user-device-sessions-query.repository';
import { UserDeviceSessionsController } from './modules/user-device-session/user-device-sessions.controller';
import { UserDeviceSessionsRepository } from './modules/user-device-session/user-device-sessions.repository';
import { UsersQueryRepository } from './modules/users/users-query.repository';
import { UsersController } from './modules/users/users.controller';
import { UsersRepository } from './modules/users/users.repository';
import { UsersService } from './modules/users/users.service';

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
