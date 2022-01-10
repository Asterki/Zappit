// * This file is used for the API route
// * /api/private/pages/main

const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const { getLang } = require('../../../utils/language');

const router = express.Router();
router.use(
    rateLimit({
        windowMs: 10 * 1000,
        max: 5,
    })
);
router.use(
    cors({
        origin: process.env.HOST,
        optionsSuccessStatus: 200,
    })
);

router.get('/index', (req, res) => {
    let lang = getLang(req.headers['accept-language'])['main']['index'];
    return res.status(200).send({ lang: lang });
});

module.exports = router;
