import { add } from 'date-fns';
import { WithId } from 'mongodb';

import { Nullable } from '../../core/types';
import { revokedRefreshTokenCollection } from '../../db';
import { RefreshTokenDBType } from '../types';

export const refreshTokenRepository = {
  async addRevokedToken(token: string): Promise<string> {
    const { insertedId } = await revokedRefreshTokenCollection.insertOne({
      token,
      expiredAt: add(new Date(), { hours: 6 }),
    });

    return insertedId.toString();
  },
  async getRevokedToken(token: string): Promise<Nullable<WithId<RefreshTokenDBType>>> {
    return revokedRefreshTokenCollection.findOne({ token });
  },
};
