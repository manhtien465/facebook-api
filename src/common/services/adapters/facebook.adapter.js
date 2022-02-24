import axios from 'axios';
// import serviceClient from '../service-client';
import SocialNetworkCampaign from '../../models/social-network-campaign.model';
import SocialNetwork from '../../models/social-network.model';

const BASE_URL = 'https://graph.facebook.com/';
// const getPost = async ({
//     limit,
//     skip,
//     access_token
// }) => {
//     try {
//         const { data: { data } } = await serviceClient.get(
//             `${BASE_URL}/post`,
//             {
//                 params: {
//                     limit: limit,
//                     offset: skip,
//                     access_token: access_token
//                 },

//             }
//         );
//         return data || [];
//     } catch (error) {
//         throw error;
//     }
// };

// const getUser = async ({
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

// const getListPage = async ({
//     user_id,
//     access_token
// }) => {
//     try {
//         const { data: { data } } = await serviceClient.get(
//             `${BASE_URL}/${user_id}/accounts`,
//             {
//                 params: {
//                     access_token: access_token
//                 },

//             }
//         );
//         return data || [];
//     } catch (error) {
//         throw error;
//     }
// };

// const getPageAccessToken = async ({
//     page_id,
//     fields,
//     access_token
// }) => {
//     try {
//         const { data: { data } } = await serviceClient.get(
//             `${BASE_URL}/${page_id}`,
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

// const getUserAccessToken = async ({
//     client_id,
//     client_secret,
//     fb_exchange_token,
//     grant_type
// }) => {
//     try {
//         const { data: { data } } = await serviceClient.get(
//             `${BASE_URL}/oauth/access_token`,
//             {
//                 params: {
//                     client_id: client_id,
//                     client_secret: client_secret,
//                     fb_exchange_token: fb_exchange_token,
//                     grant_type: grant_type
//                 },

//             }
//         );
//         return data || [];
//     } catch (error) {
//         throw error;
//     }
// };
const sendMessage = async (operations) => {
    console.log('aaaa');
    try {
        const { data: { data } } = await axios.post(
            `${BASE_URL}/me/messages`,
            {
                params: {
                    access_token: operations.secert.page_access_token
                },
                body: {
                    messaging_type: 'MESSAGE_TAG',
                    recipient: {
                        id: '5171084376237256'
                    },

                    message: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'button',
                                text: 'bạn đã dặt hàng thành công',
                                buttons: [
                                    {
                                        type: 'web_url',
                                        url: 'https://lep.vn',
                                        title: 'Check out'
                                    }
                                ]
                            }
                        }
                    },
                    tag: 'CONFIRMED_EVENT_UPDATE'
                }
            }
        );
        console.log(data);
    } catch (error) {
        throw error;
    }
};
const parseSendMessage = async (operations) => {
    const promise = operations.map(sendMessage);
    return Promise.all(promise);
};

const getWebook = async (operations) => SocialNetworkCampaign.findOne({ where: { post_id: operations.post_id, is_active: true } });
const parseWebhook = async (operations) => {
    const promise = operations.map(getWebook);
    return Promise.all(promise);
};

const getSocialNetWork = async (operations) => {
    const returnOperation = operations;
    const socialNetwork = await SocialNetwork.get(operations.social_network_id);
    returnOperation.secert = socialNetwork.secret;
    return returnOperation;
};
const parseSocialNetWork = async (operations) => {
    const promise = operations.map(getSocialNetWork);
    return Promise.all(promise);
};

export default {
    parseWebhook,
    parseSocialNetWork,
    parseSendMessage
};
