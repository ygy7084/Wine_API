import mongoose from 'mongoose';

const Configuration = new mongoose.Schema({
  email: {
    host: String,
    pwd: String,
    title: String,
    content: String,
  },
});

const model = mongoose.model('configuration', Configuration);

export default model;
