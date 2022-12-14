
import helmet from 'helmet';
import { app } from '../../index';

app.use(helmet.contentSecurityPolicy());
app.use(
    helmet.crossOriginEmbedderPolicy({
        policy: 'require-corp',
    })
);
app.use(
    helmet.crossOriginOpenerPolicy({
        policy: 'same-origin',
    })
);
app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'same-origin',
    })
);
app.use(
    helmet.dnsPrefetchControl({
        allow: false,
    })
);
app.use(
    helmet.expectCt({
        maxAge: 0,
    })
);
app.use(
    helmet.frameguard({
        action: 'sameorigin',
    })
);
app.use(
    helmet.hsts({
        maxAge: 15552000,
        includeSubDomains: true,
    })
);
app.use(
    helmet.permittedCrossDomainPolicies({
        permittedPolicies: 'none',
    })
);
app.use(
    helmet.referrerPolicy({
        policy: 'no-referrer',
    })
);
app.use(helmet.ieNoOpen());
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.xssFilter());

export { }