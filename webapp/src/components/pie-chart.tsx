import React, { useState } from "react";

interface PieChartProps {
    data: number[];
    colors?: string[];
    labels?: string[];
}

const defaultColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
    "#B4FF9F", "#FF9FB4", "#9F40FF", "#40FF9F", "#9FB4FF", "#FFB440",
    "#FF4040", "#40FF40", "#4040FF", "#FFFF40", "#40FFFF", "#FF40FF",
    "#B440FF", "#FFB440"
];

const PieChart: React.FC<PieChartProps> = ({ data, colors = defaultColors, labels = [] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const total = data.reduce((acc, value) => acc + value, 0);

    // Combine sections with values less than 5% into an "Other" section
    const combinedData = data.reduce<{ data: number[], labels: string[] }>((acc, value, index) => {
        if ((value / total) * 100 < 5) {
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

    // If there is only one section, render a full circle
    if (combinedData.data.length === 1) {
        return (
            <svg width="400" height="400" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill={colors[0]} />
                <text x="16" y="15" fill="#000" fontSize="4" textAnchor="middle" dominantBaseline="middle">
                    {combinedData.labels[0]}
                </text>
                <text x="16" y="19" fill="#000" fontSize="3" textAnchor="middle" dominantBaseline="middle">
                    100%
                </text>
            </svg>
        );
    }

    return (
        <svg width="400" height="400" viewBox="0 0 32 32">
            {combinedData.data.map((value, index) => {
                const [startX, startY] = getCoordinatesForPercent(cumulativeValue / total);
                cumulativeValue += value;
                const [endX, endY] = getCoordinatesForPercent(cumulativeValue / total);
                const largeArcFlag = value / total > 0.5 ? 1 : 0;
                const [labelX, labelY] = getCoordinatesForPercent((cumulativeValue - value / 2) / total);

                // Adjust label position to avoid clipping
                let adjustedLabelX = labelX;
                let adjustedLabelY = labelY;

                const isHovered = index === hoveredIndex;
                const translateFactor = isHovered ? 0.25 : 0; // Increased translation factor
                const translateX = isHovered ? (labelX - 16) * translateFactor : 0;
                const translateY = isHovered ? (labelY - 16) * translateFactor : 0;
                const transform = `translate(${translateX}, ${translateY})`;

                return (
                    <path
                        key={index}
                        d={`M16 16 L ${startX} ${startY} A 12 12 0 ${largeArcFlag} 1 ${endX} ${endY} Z`} // Reduced radius from 16 to 12
                        fill={colors[index % colors.length]}
                        transform={transform}
                        style={{ transition: 'transform 0.2s' }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                );
            })}
            {combinedData.data.map((value, index) => {
                cumulativeValue += value;
                const [labelX, labelY] = getCoordinatesForPercent((cumulativeValue - value / 2) / total);

                // Adjust label position to avoid clipping
                const angle = Math.atan2(labelY - 16, labelX - 16);
                const labelDistance = 9 - (4 * (value / total));
                const adjustedLabelX = 16 + Math.cos(angle) * labelDistance;
                const adjustedLabelY = 16 + Math.sin(angle) * labelDistance;


                const isHovered = index === hoveredIndex;
                const translateFactor = isHovered ? 0.25 : 0; // Increased translation factor
                const translateX = isHovered ? (labelX - 16) * translateFactor : 0;
                const translateY = isHovered ? (labelY - 16) * translateFactor : 0;
                const transform = `translate(${translateX}, ${translateY})`;

                const percentage = (value / total) * 100;
                const fontSize = 0.75 + (percentage / 100) * 3; // Adjust font size based on percentage

                return (
                    <g key={index}>
                        {combinedData.labels[index] && (
                            <text x={adjustedLabelX} y={adjustedLabelY} fill="#000" fontSize={fontSize} textAnchor="middle" dominantBaseline="middle" transform={transform} style={{ transition: 'transform 0.2s' }}>
                                {combinedData.labels[index]}
                            </text>
                        )}
                        <text x={adjustedLabelX} y={adjustedLabelY + fontSize} fill="#000" fontSize={fontSize * 0.75} textAnchor="middle" dominantBaseline="middle" transform={transform} style={{ transition: 'transform 0.2s' }}>
                            {percentage.toFixed(1)}%
                        </text>
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
