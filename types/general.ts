import React from 'react';

/**
 * Can be used when component passes down children
 */
export type Children = {
    children?: React.ReactNode;
};

/**
 * Universal result object
 */
export type Result = {
    status: 'error' | 'success';
    message?: string;
    error?: string;
};

export type APIResult = {
    status: 'error' | 'success';
    message: string;
    data: any;
};

// table heading initialiser
export type Heading = {
    text: string;
    width: string; // string width
};
