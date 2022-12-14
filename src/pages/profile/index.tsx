/* eslint-disable @next/next/no-img-element */
import React from "react";
// import axios from 'axios';
import { getLangFile } from "../../helpers/pages";

import Navbar from "../../components/navbar";

import styles from "../../styles/profile/index.module.scss";

import type { NextPage, GetServerSideProps } from "next";
import type LangPack from "../../../shared/types/lang";
import type { User } from "../../../shared/types/models";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (context.req.user == undefined)
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };

    return {
        props: {
            host: process.env.HOST,
            lang: getLangFile(context.req.headers["accept-language"], "profile", "index"),
            user: context.req.user,
        },
    };
};

interface PageProps {
    host: string;
    lang: typeof LangPack.profile.index;
	user: User
}

const Profile: NextPage<PageProps> = (props: PageProps): JSX.Element => {
    return (
        <div className={styles["page"]}>
            <h1>{props.lang.title}</h1>
            <Navbar lang={props.lang} user={props.user} />
        </div>
    );
};

export default Profile;
