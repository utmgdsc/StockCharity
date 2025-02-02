import React, { useState } from "react";

interface PieChartProps {
    data: number[];
    colors?: string[];
    labels?: string[];
}

const defaultColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
];

const PieChart: React.FC<PieChartProps> = ({ data, colors = defaultColors, labels = [] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const total = data.reduce((acc, value) => acc + value, 0);

    // Combine sections with values less than 10% into an "Other" section
    const combinedData = data.reduce<{ data: number[], labels: string[] }>((acc, value, index) => {
        if ((value / total) * 100 < 10) {
            if (acc.labels.includes("Other")) {
                acc.data[acc.labels.indexOf("Other")] += value;
            } else {
                acc.data.push(value);
                acc.labels.push("Other");
            }
        } else {
            acc.data.push(value);
            acc.labels.push(labels[index] || "");
        }
        return acc;
    }, { data: [], labels: [] });

    let cumulativeValue = 0;

    return (
        <svg width="400" height="400" viewBox="0 0 32 32">
            {combinedData.data.map((value, index) => {
                const [startX, startY] = getCoordinatesForPercent(cumulativeValue / total);
                cumulativeValue += value;
                const [endX, endY] = getCoordinatesForPercent(cumulativeValue / total);
                const largeArcFlag = value / total > 0.5 ? 1 : 0;
                const [labelX, labelY] = getCoordinatesForPercent((cumulativeValue - value / 2) / total);

                // Adjust label position to avoid clipping
                const adjustedLabelX = (labelX + 16) / 2;
                const adjustedLabelY = (labelY + 16) / 2;

                const isHovered = index === hoveredIndex;
                const translateFactor = isHovered ? 0.25 : 0; // Increased translation factor
                const translateX = isHovered ? (labelX - 16) * translateFactor : 0;
                const translateY = isHovered ? (labelY - 16) * translateFactor : 0;
                const transform = `translate(${translateX}, ${translateY})`;

                return (
                    <g key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                        <path
                            d={`M16 16 L ${startX} ${startY} A 12 12 0 ${largeArcFlag} 1 ${endX} ${endY} Z`} // Reduced radius from 16 to 12
                            fill={colors[index % colors.length]}
                            transform={transform}
                            style={{ transition: 'transform 0.2s' }}
                        />
                        {combinedData.labels[index] && (
                            <text x={adjustedLabelX} y={adjustedLabelY} fill="#000" fontSize="1.5" textAnchor="middle" dominantBaseline="middle" transform={transform} style={{ transition: 'transform 0.2s' }}>
                                {combinedData.labels[index]}
                            </text>
                        )}
                        <text x={adjustedLabelX} y={adjustedLabelY + 1.5} fill="#000" fontSize="1" textAnchor="middle" dominantBaseline="middle" transform={transform} style={{ transition: 'transform 0.2s' }}>
                            {((value / total) * 100).toFixed(1)}%
                        </text>
                        {/* This is for testing and should be deleted later */}
                        {/* <rect x="0" y="0" width="32" height="32" fill="none" stroke="black" strokeWidth="0.5" />
                        <circle cx="16" cy="16" r="0.5" fill="black" /> */}
                    </g>
                );
            })}
        </svg>
    );
};

const getCoordinatesForPercent = (percent: number) => {
    const radius = 12; // Reduced radius from 16 to 12
    const x = Math.cos(2 * Math.PI * percent) * radius + 16;
    const y = Math.sin(2 * Math.PI * percent) * radius + 16;
    
    return [x, y];
};

export default PieChart;
