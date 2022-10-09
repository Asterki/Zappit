import React from "react";
import $ from "jquery";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import styles from "../../styles/accounts/register.module.scss";
import type { NextPage } from "next";

const Register: NextPage = (props) => {
    const particlesInit = React.useCallback(async (engine: any) => {
        await loadFull(engine);
    }, []);

    React.useEffect(() => {
        $(`#main-page`).fadeIn(1000);
        $(`#particles`).fadeIn(3000);
    }, []);

    return (
        <div className={styles["page"]}>
            <p>This will be the register page</p>

            <div id="particles" hidden>
                <Particles
                    init={particlesInit}
                    options={{
                        particles: {
                            number: {
                                value: 60,
                                density: {
                                    enable: true,
                                    value_area: 800,
                                },
                            },
                            shape: {
                                polygon: {
                                    nb_sides: 5,
                                },
    
                                type: 'circle',
                            },
                            line_linked: {
                                enable: false,
                            },
                            opacity: {
                                value: 0.3,
                            },
                            size: {
                                value: 3,
                                random: true,
                                anim: {
                                    enable: false,
                                    speed: 20,
                                    size_min: 0.3,
                                    sync: false,
                                },
                            },
                            move: {
                                direction: 'none',
                                enable: true,
                                outMode: 'bounce',
                                random: false,
                                speed: 0.3,
                                straight: false,
                            },
                        },
                    }}
                />
            </div>

            <main>
                <form action="/api/accounts/register" method="POST">
                    <label htmlFor="text">Username</label>
                    <input type="text" name="username" placeholder="Username" aria-label="username input" />
                    <br />

                    <label htmlFor="text">Email</label>
                    <input type="text" name="email" placeholder="asterki.dev@proton.me" aria-label="username input" />
                    <br />

                    <label htmlFor="text">Locale</label>
                    <input type="text" name="locale" placeholder="ES" aria-label="username input" />
                    <br />

                    <label htmlFor="text">Display Name</label>
                    <input type="text" name="displayName" placeholder="displayName" aria-label="username input" />
                    <br />

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="password" aria-label="username input" />
                    <br />

                    <input type="submit" value="Submit" />
                </form>
            </main>
        </div>
    );
};

export default Register;
