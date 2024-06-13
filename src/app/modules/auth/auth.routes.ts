import express from 'express';
import { AuthVlidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validationRequest';

const router = express.Router();

router.post('/login',validateRequest(AuthVlidation.loginValidationSchema),AuthControllers.loginUser);

router.post('/change-password',auth(USER_ROLE.admin,USER_ROLE.faculty,USER_ROLE.student),validateRequest(AuthVlidation.changePasswordValidationSchema),AuthControllers.changePassword);

router.post('/refresh-token',validateRequest(AuthVlidation.refreshTokenValidationSchema),AuthControllers.changePassword);

export const AuthRoutes = router;
