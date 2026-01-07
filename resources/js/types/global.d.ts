import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { PageProps as AppPageProps } from './';
import { Config as ZiggyConfig, RouteFunction } from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
        Ziggy: ZiggyConfig;
    }

    /* eslint-disable no-var */
    var route: RouteFunction;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
