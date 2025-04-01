'use client'

import React, { useState, ReactNode } from 'react'

interface TooltipProps {
    text: string;
    children: ReactNode;
}

const Tooltipcomponent: React.FC<TooltipProps> = ({ text, children }) => {
    let timeout: NodeJS.Timeout | null = null;
    const [showTooltip, setShowTooltip] = useState(false);
    // const toggleTooltip = () => {
    //     setShowTooltip(!showTooltip);
    // };

    const toggleTooltip = (show: boolean) => {
        if (show) {
            setShowTooltip(true);
        } else {
            // Delay hiding the tooltip by 200 milliseconds
            timeout = setTimeout(() => {
                setShowTooltip(false);
            }, 70);
        }
    };

    const handleMouseEnter = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        toggleTooltip(true);
    };

    const handleMouseLeave = () => {
        toggleTooltip(false);
    };

    return (
        <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <span>
                {children}
            </span>
            {showTooltip && (
                <div className="absolute z-10 bg-gray-800 text-white py-1 px-2 rounded-md text-sm bottom-full left-1/2 transform -translate-x-1/2 mb-2 max-w-60">
                    {text}
                </div>
            )}
        </div>
    )
}

export default Tooltipcomponent