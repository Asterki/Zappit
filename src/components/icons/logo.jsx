import React from 'react';

export default function logo(props) {
    return (
        <>
            <svg
                width={props.width == undefined ? 20 : props.width}
                height={props.height == undefined ? 20 : props.height}
                viewBox="0 0 42 62"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g filter="url(#filter0_d_708_2)">
                    <path
                        d="M12.379 1.19353C12.4803 0.848868 12.6905 0.546295 12.9782 0.331131C13.2659 0.115966 13.6156 -0.00021007 13.9748 2.85157e-07H27.2732C27.5365 0.00020012 27.7959 0.0629215 28.0302 0.183001C28.2645 0.303081 28.4669 0.477084 28.6208 0.690688C28.7746 0.904292 28.8756 1.15139 28.9153 1.41163C28.955 1.67188 28.9323 1.93783 28.8491 2.18759L22.9313 19.9477H35.5848C35.8961 19.9474 36.2012 20.0346 36.4653 20.1993C36.7295 20.364 36.9421 20.5996 37.079 20.8792C37.2158 21.1588 37.2714 21.4712 37.2394 21.7808C37.2074 22.0905 37.0891 22.3849 36.898 22.6306L13.6257 52.5521C13.3873 52.8601 13.0483 53.0746 12.6679 53.1582C12.2875 53.2418 11.8898 53.1891 11.5442 53.0094C11.1987 52.8297 10.9272 52.5344 10.7772 52.1749C10.6271 51.8155 10.6081 51.4148 10.7233 51.0427L16.711 31.5838H5.66328C5.40484 31.5839 5.14992 31.5238 4.91878 31.4082C4.68763 31.2926 4.48662 31.1247 4.33171 30.9179C4.17681 30.711 4.07226 30.4709 4.02639 30.2165C3.98052 29.9622 3.99459 29.7007 4.06747 29.4527L12.379 1.19353Z"
                        fill={props.color !== undefined ? props.color : '#FFF'}
                    />
                </g>
                <defs>
                    <filter
                        id="filter0_d_708_2"
                        x="0"
                        y="0"
                        width="41.248"
                        height="61.197"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_708_2" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_708_2" result="shape" />
                    </filter>
                </defs>
            </svg>
        </>
    );
}
