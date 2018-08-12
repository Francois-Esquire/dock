import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import thrower from '../thrower';

const UserSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
  },
);

UserSchema.virtual('__typename').get(() => 'User');

UserSchema.pre('save', async function preUserSave() {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
});

UserSchema.methods = {
  changeHandle(handle) {
    // this doesn't consider collisions with existing names..
    // will fail on save - handle then.
    this.handle = handle;

    return this;
  },

  changePassword(candidate, password) {
    // respond with error if it fails.
    if (this.comparePassword(candidate)) this.password = password;
    else throw thrower(1, { method: 'changePassword' });

    return this;
  },

  comparePassword(password) {
    // compare the user password with the candidate
    return bcrypt.compareSync(password, this.password);
  },
};

UserSchema.statics = {
  async findUserById(id) {
    const user = await this.findById(id);

    if (user) return user;

    throw thrower(0, { method: 'findUserById' });
  },

  async findUserByHandle(handle) {
    const user = await this.findOne({ handle });

    if (user) return user;

    throw thrower(0, { method: 'findUserByHandle' });
  },

  async login(profile) {
    const { handle, password } = profile;

    const user = await this.findUserByHandle(handle);

    if (user.comparePassword(password)) return user;

    return thrower(1, { method: 'login' });
  },

  async changeHandle(id, handle) {
    const user = await this.findUserById(id);

    try {
      await user.changeHandle(handle).save();
    } catch (e) {
      if (e.code === 11000)
        throw thrower(2, { error: e, method: 'changeHandle' });

      throw e;
    }

    return user;
  },

  async changePassword(id, candidate, newPassword) {
    const user = await this.findUserById(id);

    await user.changePassword(candidate, newPassword).save();

    return user;
  },

  async resetPassword(id, password) {
    const user = await this.findUserById(id);

    user.password = password;

    await user.save();

    return user;
  },

  async createUser(profile) {
    const User = this;

    const { handle, password } = profile;

    const user = new User({
      handle,
      password,
    });

    try {
      await user.save();
    } catch (e) {
      if (e.code === 11000)
        throw thrower(2, { error: e, method: 'createUser' });

      throw e;
    }

    return user;
  },

  async deleteUser(id) {
    const user = await this.findUserById(id);

    await user.remove();

    return user;
  },
};

export default UserSchema;
