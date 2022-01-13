// * This file is used for the API route
// * /api/private/pages/

const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const { getLang } = require('../../utils/locales');

const router = express.Router();
router.use(
    cors({
        origin: process.env.HOST,
        optionsSuccessStatus: 200,
    })
);
router.use(
    rateLimit({
        windowMs: 10 * 1000,
        max: 5,
    })
);

// * Main
router.get('/main/index', (req, res) => {
    let lang = getLang(req.headers['accept-language'])['main']['index'];
    return res.status(200).send({ lang: lang });
});

// * Accounts
router.get('/accounts/login', (req, res) => {
    let lang = getLang(req.headers['accept-language'])['accounts']['login'];
    return res.status(200).send({ lang: lang });
});

router.get('/accounts/register', (req, res) => {
    let lang = getLang(req.headers['accept-language'])['accounts']['register'];
    return res.status(200).send({ lang: lang });
})

module.exports = router;
