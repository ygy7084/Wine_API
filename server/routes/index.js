import express from 'express';
import original from './original';
import vintage from './vintage';
import sale from './sale';
import location from './location';
import grape from './grape';
import customer from './customer';
import customerBase from './customerBase';
import shop from './shop';
import store from './store';
import account from './account';
import excel from './excel';

const router = express.Router();
router.use('/original', original);
router.use('/vintage', vintage);
router.use('/sale', sale);
router.use('/location', location);
router.use('/grape', grape);
router.use('/customer', customer);
router.use('/customerbase', customerBase);
router.use('/shop', shop);
router.use('/store', store);
router.use('/account', account);
router.use('/excel', excel);

export default router;
