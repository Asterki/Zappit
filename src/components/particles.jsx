import React from 'react';
import Particles from 'react-tsparticles';

export default function ParticlesComponent(props) {
    return (
        <>
            <Particles
                options={{
                    particles: {
                        shape: {
                            number: {
                                value: 60,
                                density: {
                                    enable: true,
                                    value_area: 800,
                                },
                            },
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
        </>
    );
}
