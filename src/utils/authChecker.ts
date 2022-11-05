import { AuthChecker } from 'type-graphql';
import jwt from 'jsonwebtoken';

import envConfig from '../config/env';
import { GraphQLContext } from '../types/context';

export const authChecker: AuthChecker<GraphQLContext> = ({ context }) => {
  try {
    const user = jwt.verify(context.token || '', envConfig.secret);

    return !!user;
  } catch(e) {
    return false;
  }
}
