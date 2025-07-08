import { FormatStyleName } from 'javascript-time-ago';
export declare const getTimeUnitParts: (timeUnit: string) => {
    num?: undefined;
    unit?: undefined;
} | {
    num: number;
    unit: string;
};
export declare const formatTimeAgo: (value: string | Date, formatStyle?: string | FormatStyleName) => string;
