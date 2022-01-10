import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import $ from 'jquery';
import Link from 'next/link';

import * as utils from '../../utils';
import styles from '../../assets/styles/accounts/login.module.scss';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Particles from '../../components/elements/particles';

import Eye from '../../components/icons/eye';
import Logo from '../../components/icons/logo';
import ReturnButton from '../../components/icons/return-button';

export async function getServerSideProps({ req, res }) {
    const response = await axios({
        method: 'get',
        url: `${process.env.HOST}/api/private/pages/accounts/login`,
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

export default function LoginPage(props) {
    const [showingPassword, setShowingPassword] = useState(false);

    useEffect(() => {
        $('#show-password-button').on('click', () => {
            setShowingPassword(!showingPassword);
        });

        $("#return-button").on('click', () => {
            window.location.href = '/';
        });
    });

    return (
        <div className={styles.page}>
            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <div className={styles.particles}>
                {/* <Particles /> */}
            </div>

            <main>
                <div className={styles['return-button']}>
                    <ReturnButton id="return-button" width="50" height="50" />
                </div>

                <div className={styles['title']}>
                    <Logo color="white" width="50" height="50" />
                    <h1>{props.lang.title}</h1>
                </div>

                <Form action="/api/private/accounts/login" method="post">
                    <Form.Label htmlFor="email">{props.lang.email}</Form.Label>
                    <InputGroup className={`mb-3 ${styles['input-group']}`}>
                        <Form.Control
                            className="shadow-none text-white"
                            placeholder={props.lang.emailPlaceholder}
                            aria-label={props.lang.emailPlaceholder}
                            name="email"
                            required
                        />
                    </InputGroup>
                    <p>
                        {props.lang.register.split('&')[0]}
                        <Link href="/register">{props.lang.register.split('&')[1]}</Link>
                    </p>
                    <br />

                    <Form.Label htmlFor="password">{props.lang.password}</Form.Label>
                    <InputGroup className={`mb-3 ${styles['input-group']}`}>
                        <Form.Control
                            className="shadow-none text-white"
                            placeholder={props.lang.passwordPlaceholder}
                            aria-label={props.lang.passwordPlaceholder}
                            name="password"
                            type={showingPassword ? 'text' : 'password'}
                            required
                        />
                        <InputGroup.Text id="show-password-button">
                            <Eye width="20" height="20" open={showingPassword} />
                        </InputGroup.Text>
                    </InputGroup>
                    <p>
                        {props.lang.forgotPassword.split('&')[0]}
                        <Link href="/register">{props.lang.forgotPassword.split('&')[1]}</Link>
                    </p>

                    <button type="submit">
                        <span>{props.lang.login}</span>
                    </button>
                </Form>
            </main>
        </div>
    );
}
