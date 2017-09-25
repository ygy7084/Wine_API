import express from 'express';
import original from './original';
import vintage from './vintage';
import sale from './sale';
import location from './location';
import category from './category';
import grape from './grape';
import customer from './customer';
import shop from './shop';
import store from './store';
import account from './account';

const router = express.Router();
router.use('/original', original);
router.use('/vintage', vintage);
router.use('/sale', sale);
router.use('/location', location);
router.use('/category', category);
router.use('/grape', grape);
router.use('/customer', customer);
router.use('/shop', shop);
router.use('/store', store);
router.use('/account', account);

export default router;
