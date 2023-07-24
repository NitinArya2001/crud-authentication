import express from 'express';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';
const router = express.Router();

import {registercontroller,refreshcontroller,productcontroller,logincontroller,usercontroller,ordercontroller} from '../controller';

router.post('/register', registercontroller.register);
router.post('/login', logincontroller.login);
router.get('/me',auth, usercontroller.me);
router.post('/refresh', refreshcontroller.refresh);
router.post('/logout',auth, logincontroller.logout);


router.post('/products',[auth,admin], productcontroller.store);
router.put('/products/:id', [auth, admin], productcontroller.update);
router.delete('/products/:id', [auth, admin], productcontroller.destroy);
router.get('/products', productcontroller.index);
router.get('/products/:id', productcontroller.show);


router.post('/status',ordercontroller.status);
router.post('/order',ordercontroller.order);

export default router; 