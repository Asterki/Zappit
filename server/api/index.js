/*
  ___          _  ___  ___                                                           _   
 / _ \        (_) |  \/  |                                                          | |  
/ /_\ \ _ __   _  | .  . |  __ _  _ __    __ _   __ _   ___  _ __ ___    ___  _ __  | |_ 
|  _  || '_ \ | | | |\/| | / _` || '_ \  / _` | / _` | / _ \| '_ ` _ \  / _ \| '_ \ | __|
| | | || |_) || | | |  | || (_| || | | || (_| || (_| ||  __/| | | | | ||  __/| | | || |_ 
\_| |_/| .__/ |_| \_|  |_/ \__,_||_| |_| \__,_| \__, | \___||_| |_| |_| \___||_| |_| \__|
       | |                                       __/ |                                   
       |_|                                      |___/                                    
*/

const private = {
    pages: {
        main: require('./private/pages/main'),
        accounts: require('./private/pages/accounts'),
    },
    upload: {},
};

const public = {};

module.exports = (app) => {
    // * /api/private/pages/
    app.use('/api/private/pages/main', private.pages.main);
    app.use('/api/private/pages/accounts', private.pages.accounts);
};
