import { User } from '../../models';

export default {
  async login(_, args) {
    // also check for user in root
    const { profile } = args;

    const user = await User.login(profile);

    return user;
  },

  async signup(_, args) {
    const { profile } = args;

    const user = await User.createUser(profile);

    return user;
  },

  async changeHandle(_, args) {
    const { handle } = args;

    const user = await User.changeHandle(_.user, handle);

    return user;
  },

  async changePassword(_, args) {
    const { pass, word } = args;

    const user = await User.changePassword(_.user, pass, word);

    return !!user;
  },

  async deleteAccount(_) {
    const user = await User.deleteAccount(_.user);

    return !!user;
  },
};
