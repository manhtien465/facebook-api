import serviceClient from '../service-client';

const BASE_URL = 'https://graph.facebook.com/';
const getPost = async ({
    limit,
    skip,
    access_token
}) => {
    try {
        const { data: { data } } = await serviceClient.get(
            `${BASE_URL}/post`,
            {
                params: {
                    limit: limit,
                    offset: skip,
                    access_token: access_token
                },

            }
        );
        return data || [];
    } catch (error) {
        throw error;
    }
};

const getUser = async ({
    fields,
    access_token
}) => {
    try {
        const { data: { data } } = await serviceClient.get(
            `${BASE_URL}/v12.0/me`,
            {
                params: {
                    fields: fields,
                    access_token: access_token
                },

            }
        );
        return data || [];
    } catch (error) {
        throw error;
    }
};

const getListPage = async ({
    user_id,
    access_token
}) => {
    try {
        const { data: { data } } = await serviceClient.get(
            `${BASE_URL}/${user_id}/accounts`,
            {
                params: {
                    access_token: access_token
                },

            }
        );
        return data || [];
    } catch (error) {
        throw error;
    }
};

const getPageAccessToken = async ({
    page_id,
    fields,
    access_token
}) => {
    try {
        const { data: { data } } = await serviceClient.get(
            `${BASE_URL}/${page_id}`,
            {
                params: {
                    fields: fields,
                    access_token: access_token
                },

            }
        );
        return data || [];
    } catch (error) {
        throw error;
    }
};

export default {
    getPost,
    getPageAccessToken,
    getUser,
    getListPage
};
