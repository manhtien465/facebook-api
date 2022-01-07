import axios from 'axios';
import { cloneDeep } from 'lodash';

const DEFAULT_OPTIONS = {
    headers: {
        'X-Consumer-Groups': 'service',
        'X-Anonymous-User': 'true'
    }
};

module.exports = {
    get: (url, options = {}) => {
        const defaultOptions = cloneDeep(DEFAULT_OPTIONS);
        return axios.get(url, Object.assign(defaultOptions, options));
    },
    post: (url, data, options = {}) => {
        const defaultOptions = cloneDeep(DEFAULT_OPTIONS);
        return axios.post(url, data, Object.assign(defaultOptions, options));
    },
    put: (url, data, options = {}) => {
        const defaultOptions = cloneDeep(DEFAULT_OPTIONS);
        return axios.put(url, data, Object.assign(defaultOptions, options));
    },
    delete: (url, options = {}) => {
        const defaultOptions = cloneDeep(DEFAULT_OPTIONS);
        return axios.delete(url, Object.assign(defaultOptions, options));
    }
};
