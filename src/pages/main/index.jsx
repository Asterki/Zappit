import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

import styles from '../../assets/styles/main/index.module.scss';
import * as utils from '../../utils';

export async function getServerSideProps({ req, res }) {
    const response = await axios({
        method: 'get',
        url: `${process.env.HOST}/api/private/pages/main/index`,
        headers: {
            'accept-language': req.headers['accept-language'],
        },
    }).catch((error) => {
        let reportCode = utils.errors.generateReport(error);
        return {
            redirect: {
                destination: `/error?code=${reportCode}`,
                permanent: false,
            },
        };
    });

    return {
        props: {
            lang: response.data.lang,
        },
    };
}

export default function Index(props) {
    return (
        <div className={styles.page}>
            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Link href="/accounts/login">Login</Link>
            <h1>{props.lang.pageTitle}</h1>
        </div>
    );
}
