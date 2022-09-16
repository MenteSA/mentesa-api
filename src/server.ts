import App from '@/app';
import validateEnv from '@utils/validateEnv';
import { AuthRoute } from './routes/auth.route';
import UserRoute from './routes/user.route';

validateEnv();

const app = new App([new AuthRoute(), new UserRoute()]);

app.listen();
