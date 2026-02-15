import { Container } from 'inversify';

import { UsersService } from './users/application';
import { UsersController } from './users/controller/users.controller';
import { UsersQueryRepository, UsersRepository } from './users/repository';

export const iocContainer = new Container();

iocContainer.bind(UsersRepository).toSelf();
iocContainer.bind(UsersQueryRepository).toSelf();
iocContainer.bind(UsersService).toSelf();
iocContainer.bind(UsersController).toSelf();
