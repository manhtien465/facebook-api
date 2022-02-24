import axios from 'axios';
import serviceClient from '../service-client';

const BASE_URL = 'https://graph.facebook.com';
const getPosts = async ({
    limit = 100,
    skip = 0,
    access_token,
    page_id
}) => {
    try {
        const { data: { data } } = await axios.get(
            `${BASE_URL}/${page_id}/posts`,
            {
                params: {
                    limit: limit,
                    offset: skip,
                    access_token: access_token,
                    fields: 'attachments.limit(10){title,url,description,subattachments,media,media_type,type,unshimmed_url,target,description_tags},id,message,created_time'
                },

            }
        );
        return data || [];
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// const getUserFacebook = async ({
//     fields,
//     access_token
// }) => {
//     try {
//         const { data: { data } } = await axios.get(
//             `${BASE_URL}/v12.0/me`,
//             {
//                 params: {
//                     fields: fields,
//                     access_token: access_token
//                 },

//             }
//         );
//         return data || [];
//     } catch (error) {
//         throw error;
//     }
// };

const getPages = async ({
    user_id,
    access_token
}) => {
    try {
        console.log(access_token);
        const { data: { data } } = await axios.get(
            `${BASE_URL}/${user_id}/accounts`,
            {
                params: {
                    access_token: access_token,
                    fields: 'cover,name,description,link,phone'
                },

            }
        );
        return data || [];
    } catch (error) {
        throw error;
    }
};

const getPageAccessTokenFaceebook = async ({
    page_id,
    fields = 'access_token',
    access_token
}) => {
    try {
        console.log(access_token);
        const { data: { data } } = await serviceClient.get(
            `${BASE_URL}/${page_id}`,
            {
                params: {
                    fields: fields,
                    access_token: access_token
                },

            }
        );
        console.log(data);
        return data || null;
    } catch (error) {
        throw error;
    }
};

const getUserFacebook = async ({
    client_id,
    client_secret,
    fb_exchange_token,
    grant_type
}) => {
    try {
        const user = {};
        await axios.get(
            `${BASE_URL}/oauth/access_token`,
            {
                params: {
                    client_id: client_id,
                    client_secret: client_secret,
                    fb_exchange_token: fb_exchange_token,
                    grant_type: grant_type
                },

            }
        ).then((res) => {
            user.user_access_token = res.data.access_token;
        });

        await axios.get(
            `${BASE_URL}/me`,
            {
                params: {
                    access_token: user.user_access_token,
                    fields: 'id,name'
                },

            }
        ).then((res) => {
            user.user_id = res.data.id;
            user.name = res.data.name;
        });
        console.log(user);
        return user || [];
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export default {
    getPosts,
    getPageAccessTokenFaceebook,
    // getUserFacebook,
    getPages,
    getUserFacebook
};
