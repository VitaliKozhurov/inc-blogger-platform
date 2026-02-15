import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { inject, injectable } from 'inversify';

import { HTTP_STATUSES, RequestWithBodyType, RequestWithUriParamType } from '../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../core/utils';
import { UsersService } from '../application';
import { UsersQueryRepository } from '../repository';
import { CreateUserInputType, UsersRequestQueryType } from '../types';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) private usersService: UsersService,
    @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository
  ) {}

  async getUsers(req: Request, res: Response) {
    const query = matchedData<UsersRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const usersViewModel = await this.usersQueryRepository.getUsers(query);

    res.status(HTTP_STATUSES.OK).send(usersViewModel);
  }

  async createUser(req: RequestWithBodyType<CreateUserInputType>, res: Response) {
    const result = await this.usersService.createUser(req.body);

    if (result.status !== RESULT_STATUSES.OK) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorMessages: result.extensions });
    }

    const createdUser = await this.usersQueryRepository.getUserById(result.data!.id);

    return res.status(HTTP_STATUSES.CREATED).send(createdUser);
  }

  async deleteUserById(req: RequestWithUriParamType, res: Response) {
    const result = await this.usersService.deleteUserById(req.params.id);

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }
}
