import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            {/* Two houses on hills */}
            <path
                d="M8 20L12 16V28H8V20Z"
                fill="currentColor"
            />
            <path
                d="M16 20L20 16V28H16V20Z"
                fill="currentColor"
            />
            {/* Hills/landscape base */}
            <path
                d="M2 28C2 28 6 24 12 24C18 24 22 28 22 28V32H2V28Z"
                fill="currentColor"
            />
            <path
                d="M18 28C18 28 22 24 28 24C34 24 38 28 38 28V32H18V28Z"
                fill="currentColor"
            />
        </svg>
    );
}
