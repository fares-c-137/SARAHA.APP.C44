import dotenv from 'dotenv';
import logUtil from './utils/logUtil.js';
import { connect } from './config/database.js';
import app from './application.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

await connect();

app.listen(PORT, () => {
  logUtil.success(`Server running on port ${PORT}`);
});