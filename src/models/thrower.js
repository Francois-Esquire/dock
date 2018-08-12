export default function _throw(code, ctx) {
  // TODO:
  // 1. add logger
  // 2. send over context
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
