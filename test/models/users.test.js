import test from 'ava';

import _mongo from '../_mongo';

test.before(_mongo.start);
test.after.always(_mongo.stop);

test.beforeEach(async t => {
  const handle = 'swag';
  const password = 'cantseeme';
  const alternate = 'energy-drink';

  // eslint-disable-next-line no-param-reassign
  t.context = {
    handle,
    password,
    alternate,
  };
});

/*
  USER STORY

  walk through the lifecycle of an account via the user model.
*/

const { User } = _mongo.models;

test.serial('User::statics:createUser', async t => {
  const { handle, password } = t.context;

  const profile = {
    handle,
    password,
  };

  const user = await User.createUser(profile);

  t.plan(7);

  await t.throws(async () => {
    await User.createUser(profile);
  }, 'Username Is Already Taken');

  t.is(user.__typename, 'User');

  t.is(user.handle, handle);
  t.not(user.password, password);
  t.true(user.comparePassword(password));

  t.true(user.createdAt instanceof Date);
  t.true(user.updatedAt instanceof Date);
});

test.serial('User::statics:changeHandle', async t => {
  const u = await User.findOne({});

  const { handle, alternate } = t.context;

  const user = await User.changeHandle(u._id, alternate);

  t.plan(2);

  t.is(u.handle, handle);
  t.is(user.handle, alternate);
});

test.serial('User::statics:changePassword', async t => {
  const u = await User.findOne({});

  const { password: candidate, alternate: password } = t.context;

  const user = await User.changePassword(u._id, candidate, password);

  t.plan(3);

  t.not(user.password, password);
  t.true(user.comparePassword(password));
  t.false(user.comparePassword(candidate));
});

test.serial('User::statics:resetPassword', async t => {
  const u = await User.findOne({});

  const { password, alternate } = t.context;

  // reset to original password
  const user = await User.resetPassword(u._id, password);

  t.plan(3);

  t.not(user.password, password);
  t.true(user.comparePassword(password));
  t.false(user.comparePassword(alternate));
});

test.serial('User::statics:login', async t => {
  const u = await User.findOne({});

  // handle was changed earlier
  const { password, alternate } = t.context;

  const profile = { handle: alternate, password };

  const user = await User.login(profile);

  t.deepEqual(user._id, u._id);
});

test.serial('User::statics:deleteUser', async t => {
  const u = await User.findOne({});

  await User.deleteUser(u._id);

  t.is(await User.find({}).countDocuments(), 0);
});

// THE END
