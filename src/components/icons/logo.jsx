import React from 'react';

export default function logo(props) {
    return (
        <>
            <svg
                width={props.width == undefined ? 20 : props.width}
                height={props.height == undefined ? 20 : props.height}
                viewBox="0 0 90 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M58.3669 31.1249L74.4993 9.09407C77.5462 4.93292 73.3366 -0.650087 68.4979 1.13472L3.40591 25.1441C-0.200699 26.4744 -1.17082 31.1207 1.60215 33.783L31.0383 62.0448C32.9198 63.8511 33.1739 66.7708 31.633 68.8751L15.5008 90.9058C12.4537 95.0672 16.6633 100.65 21.5022 98.8653L86.5941 74.8559C90.2007 73.5258 91.1708 68.8793 88.3979 66.2169L58.9618 37.9554C57.0803 36.1491 56.826 33.2292 58.3669 31.1249Z"
                    fill={props.color !== undefined ? props.color : '#FFF'}
                />
            </svg>
        </>
    );
}
