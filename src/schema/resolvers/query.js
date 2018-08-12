import { User } from '../../models';

export default {
  me(_) {
    // check if root value has user
    const { user = null } = _;

    return user && User.findUserById(user);
  },
  node(_, args) {
    const { id, type = 'User' } = args;

    switch (type) {
      default:
        return null;
      case 'User':
        return User.findUserById(id);
    }
  },
};
