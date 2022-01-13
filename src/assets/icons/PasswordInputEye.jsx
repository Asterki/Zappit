import { motion } from 'framer-motion';
import React from 'react';

export default function PassswordInputEye(props) {
    return (
        <>
            <svg
                width={props.width == undefined ? 20 : props.width}
                height={props.height == undefined ? 20 : props.height}
                viewBox="0 0 38 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2 16.2684C2 16.2684 8.13455 3.99927 18.87 3.99927C29.6055 3.99927 35.74 16.2684 35.74 16.2684C35.74 16.2684 29.6055 28.5374 18.87 28.5374C8.13455 28.5374 2 16.2684 2 16.2684Z"
                    stroke="#747474"
                    strokeWidth="3.11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M18.87 20.8693C21.411 20.8693 23.4709 18.8094 23.4709 16.2684C23.4709 13.7274 21.411 11.6675 18.87 11.6675C16.3289 11.6675 14.269 13.7274 14.269 16.2684C14.269 18.8094 16.3289 20.8693 18.87 20.8693Z"
                    stroke="#747474"
                    strokeWidth="3.11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <motion.path
                    d="M5 2.00008L33.0794 30.0801"
                    stroke="#747474"
                    strokeWidth="3.11076"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                        hidden: {
                            pathLength: 0,
                            opacity: 0,
                            transition: {
                                duration: 0.3,
                                opacity: {
                                    delay: 0.3,
                                },
                            },
                        },
                        visible: {
                            pathLength: 1,
                            opacity: 1,
                        },
                    }}
                    initial={props.open ? 'hidden' : 'visible'}
                    animate={props.open ? 'hidden' : 'visible'}
                />
            </svg>
        </>
    );
}
