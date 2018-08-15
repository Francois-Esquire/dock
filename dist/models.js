'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

function _throw(code, ctx) {
  switch (code) {
    default:
    case 0:
      return new Error('User Not Found');
    case 1:
      return new Error('Password Is Incorrect');
    case 2:
      return new Error('Username Is Already Taken');
  }
}

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
  }
);
UserSchema.virtual('__typename').get(() => 'User');
UserSchema.pre('save', async function preUserSave() {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
});
UserSchema.methods = {
  changeHandle(handle) {
    this.handle = handle;
    return this;
  },
  changePassword(candidate, password) {
    if (this.comparePassword(candidate)) { this.password = password; }
    else { throw _throw(1, { method: 'changePassword' }); }
    return this;
  },
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
};
UserSchema.statics = {
  async findUserById(id) {
    const user = await this.findById(id);
    if (user) { return user; }
    throw _throw(0, { method: 'findUserById' });
  },
  async findUserByHandle(handle) {
    const user = await this.findOne({ handle });
    if (user) { return user; }
    throw _throw(0, { method: 'findUserByHandle' });
  },
  async login(profile) {
    const { handle, password } = profile;
    const user = await this.findUserByHandle(handle);
    if (user.comparePassword(password)) { return user; }
    return _throw(1, { method: 'login' });
  },
  async changeHandle(id, handle) {
    const user = await this.findUserById(id);
    try {
      await user.changeHandle(handle).save();
    } catch (e) {
      if (e.code === 11000)
        { throw _throw(2, { error: e, method: 'changeHandle' }); }
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
        { throw _throw(2, { error: e, method: 'createUser' }); }
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

const User = mongoose.model('User', UserSchema);

exports.User = User;
