import express from 'express';
import wine from './wine';
import vintage from './vintage';
import sale from './sale';
import location from './location';
import category from './category';
import grape from './grape';
// import reservation from './reservation';
// import show from './show';
// import showtime from './showtime';
// import theater from './theater';
// import seats from './seats';
// import ticket from './ticket';
// import seatsSerial from './seatsSerial';
//

const router = express.Router();
router.use('/wine', wine);
router.use('/vintage', vintage);
router.use('/sale',sale);
router.use('/location', location);
router.use('/category', category);
router.use('/grape', grape);
// router.use('/excel', excel);
// router.use('/reservation', reservation);
// router.use('/show', show);
// router.use('/showtime', showtime);
// router.use('/theater', theater);
// router.use('/seats', seats);
// router.use('/ticket', ticket);
// router.use('/seatsSerial', seatsSerial);

export default router;
