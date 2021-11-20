import { runApp } from './app/app';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

runApp().catch((e) => {
  console.log(e);
  throw e;
});
