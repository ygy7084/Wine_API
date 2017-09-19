import express from 'express';
import wine from './wine';
import vintage from './vintage';
import sale from './sale';
import location from './location';
import category from './category';
import grape from './grape';
import customer from './customer';
import shop from './shop';
import store from './store';

//

const router = express.Router();
router.use('/wine', wine);
router.use('/vintage', vintage);
router.use('/sale',sale);
router.use('/location', location);
router.use('/category', category);
router.use('/grape', grape);
router.use('/customer', customer);
router.use('/shop', shop);
router.use('/store', store);

export default router;
