import { Container } from 'inversify';

import { AuthTokenAdapter, EmailRegistrationAdapter } from './auth/adapters';
import { AuthService } from './auth/application';
import { AuthController } from './auth/controller';
import { CommentsService } from './comments/application';
import { CommentsController } from './comments/controller';
import { CommentsQueryRepository, CommentsRepository } from './comments/repository';
import { EmailAdapter, JWTAdapter, PasswordHashAdapter } from './core/adapters';
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
iocContainer.bind(EmailAdapter).toSelf();
iocContainer.bind(JWTAdapter).toSelf();
iocContainer.bind(PasswordHashAdapter).toSelf();

// auth
iocContainer.bind(AuthTokenAdapter).toSelf();
iocContainer.bind(EmailRegistrationAdapter).toSelf();
iocContainer.bind(AuthService).toSelf();
iocContainer.bind(AuthController).toSelf();

// sessions
iocContainer.bind(UserDeviceSessionsRepository).toSelf();
iocContainer.bind(UserDeviceSessionsQueryRepository).toSelf();
iocContainer.bind(UserDeviceSessionsService).toSelf();
iocContainer.bind(UserDeviceSessionsController).toSelf();

// users
iocContainer.bind(UsersRepository).toSelf();
iocContainer.bind(UsersQueryRepository).toSelf();
iocContainer.bind(UsersService).toSelf();
iocContainer.bind(UsersController).toSelf();

// comments
iocContainer.bind(CommentsRepository).toSelf();
iocContainer.bind(CommentsQueryRepository).toSelf();
iocContainer.bind(CommentsService).toSelf();
iocContainer.bind(CommentsController).toSelf();
