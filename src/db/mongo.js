import mongoose from 'mongoose';

const options = {
  useNewUrlParser: true,
};

// connection promise
const connection = mongoose.connect(
  process.env.MONGODB_URI,
  options,
);

export default connection;
