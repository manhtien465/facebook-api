/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
import { Op } from 'sequelize';
import request from 'supertest';
import httpStatus from 'http-status';
import { expect } from 'chai';
import { omit } from 'lodash';
import app from '../../../index';
import Post from '../../../common/models/post.model';

const token = process.env.BEARER_TOKEN;
describe('posts API', async () => {
    let records;
    let newRecord;

    beforeEach(async () => {
        records = [
            {
                type: 'blog',
                title: 'bai viet 1',
                slug: 'bai-viet-1',
                avatar: 'bai-viet-1.png',
                description: 'trang diem 1',
                content: 'trang diem - make up',
                categories: [
                    {
                        id: 1,
                        name: 'trang điểm',
                        slug: 'trang-diem'
                    }
                ],
                hashtag: [
                    'trang diem',
                    'make up'
                ]
            },
            {
                type: 'blog',
                title: 'bai viet 2',
                slug: 'bai-viet-2',
                avatar: 'bai-viet-2.png',
                description: 'trang diem 2',
                content: 'trang diem - make up',
                categories: [
                    {
                        id: 1,
                        name: 'trang điểm',
                        slug: 'trang-diem'
                    }
                ],
                hashtag: [
                    'trang diem',
                    'make up'
                ]
            },
            {
                type: 'blog',
                title: 'bai viet 3',
                slug: 'bai-viet-3',
                avatar: 'bai-viet-3.png',
                description: 'trang diem 3',
                content: 'trang diem - make up',
                categories: [
                    {
                        id: 1,
                        name: 'trang điểm',
                        slug: 'trang-diem'
                    }
                ],
                hashtag: [
                    'trang diem',
                    'make up'
                ],
                is_display: false
            }
        ];
        newRecord = {
            type: 'blog',
            title: 'bai viet 7',
            slug: 'bai-viet-7',
            avatar: 'bai-viet-7.png',
            description: 'trang diem 7',
            content: 'trang diem - make up',
            categories: [
                {
                    id: 1,
                    name: 'trang điểm',
                    slug: 'trang-diem'
                }
            ],
            hashtag: [
                'trang diem',
                'make up'
            ],
            is_display: false
        };

        await Post.destroy({
            where: { id: { [Op.ne]: null } }
        });

        await Post.bulkCreate(records);
    });

    describe('GET /admin/v1/posts/:id', () => {
        it('should get posts by id', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .get(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    console.log('ok');
                });
        });
        it('should report error when get a posts with id not a number', async () => {
            return request(app)
                .get('/admin/v1/posts/asdasd')
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('id');
                    expect(location).to.be.equal('params');
                    expect(messages).to.include('"id" must be a number');
                    console.log('ok');
                });
        });
        it('should report error when id not found', () => {
            return request(app)
                .get('/admin/v1/posts/10000')
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.code).to.equal(404);
                    expect(res.body.message).to.equal('not_found');
                    console.log('ok');
                });
        });
    });

    describe('GET /admin/v1/posts', () => {
        it('should get all posts', () => {
            return request(app)
                .get('/admin/v1/posts')
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.count).to.be.an('number');
                    expect(res.body.count).to.be.have.eq(3);

                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(3);
                    console.log('ok');
                });
        });
        it('should get all posts with skip and limit', () => {
            return request(app)
                .get('/admin/v1/posts')
                .set('Authorization', token)
                .query({ skip: 2, limit: 20 })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.count).to.be.an('number');
                    expect(res.body.count).to.be.have.eq(3);

                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(1);
                    console.log('ok');
                });
        });
        it('should report error when skip is not a number', () => {
            return request(app)
                .get('/admin/v1/posts')
                .set('Authorization', token)
                .query({ skip: 'asdasd', limit: 20 })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('skip');
                    expect(location).to.be.equal('query');
                    expect(messages).to.include('"skip" must be a number');
                    console.log('ok');
                });
        });
        it('should report error when limit is not a number', () => {
            return request(app)
                .get('/admin/v1/posts')
                .set('Authorization', token)
                .query({ skip: 0, limit: 'dasdasdads' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('limit');
                    expect(location).to.be.equal('query');
                    expect(messages).to.include('"limit" must be a number');
                    console.log('ok');
                });
        });
        it('should get all posts with parmas keyword: bai viet 1', () => {
            return request(app)
                .get('/admin/v1/posts')
                .set('Authorization', token)
                .query({ keyword: 'bai viet 1' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.count).to.be.an('number');
                    expect(res.body.count).to.be.have.eq(1);

                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(1);
                    console.log('ok');
                });
        });
        it('should get all posts with parmas is_display: true', () => {
            return request(app)
                .get('/admin/v1/posts')
                .set('Authorization', token)
                .query({ is_display: true })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.count).to.be.an('number');
                    expect(res.body.count).to.be.have.eq(2);

                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(2);
                    console.log('ok');
                });
        });
        it('should get all posts with parmas is_display: false', () => {
            return request(app)
                .get('/admin/v1/posts')
                .set('Authorization', token)
                .query({ is_display: false })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.count).to.be.an('number');
                    expect(res.body.count).to.be.have.eq(1);

                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(1);
                    console.log('ok');
                });
        });
    });


    describe('POST /admin/v1/posts', () => {
        it('should create a new posts when request is ok', () => {
            return request(app)
                .post('/admin/v1/posts')
                .set('Authorization', token)
                .send(newRecord)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    console.log('ok');
                });
        });
        it('should report error when required fields is not provided', () => {
            const requiredFields = [
                'type',
                'title',
                'slug',
                'avatar',
                'description',
                'content',
                'categories'
            ];
            newRecord = omit(newRecord, requiredFields);
            return request(app)
                .post('/admin/v1/posts')
                .set('Authorization', token)
                .send(newRecord)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    for (
                        let index = 0;
                        index < requiredFields.length;
                        index += 1
                    ) {
                        const field = requiredFields[index];
                        expect(res.body.errors[index].field).to.be.equal(
                            `${field}`
                        );
                        expect(res.body.errors[index].location).to.be.equal(
                            'body'
                        );
                        expect(res.body.errors[index].messages).to.include(
                            `"${field}" is required`
                        );
                    }
                });
        });
        it('should create a new posts and set default values', () => {
            const defaultValues = ['hashtag', 'is_display'];
            newRecord = omit(
                newRecord, defaultValues
            );
            return request(app)
                .post('/admin/v1/posts')
                .set('Authorization', token)
                .send(newRecord)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const {
                        created_by,
                    } = res.body.data;
                    expect(res.body.code).to.equal(0);
                    expect(created_by).to.be.an('object');
                });
        });
    });


    describe('PUT /admin/v1/posts/:id', () => {
        it('should report error when update a posts with id not a number ', () => {
            return request(app)
                .put('/admin/v1/posts/asdasdasd')
                .set('Authorization', token)
                .send({ name: 'name updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('id');
                    expect(location).to.be.equal('params');
                    expect(messages).to.include('"id" must be a number');
                    console.log('ok');
                });
        });
        it('should report error when update a posts not found ', () => {
            return request(app)
                .put('/admin/v1/posts/10000')
                .set('Authorization', token)
                .send({ name: 'name updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(404);
                    expect(res.body.message).to.equal('not_found');
                    console.log('ok');
                });
        });
        it('should update correct type posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ type: 'blog' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect type posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ type: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('type');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"type" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct title posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ title: 'title updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect title posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ title: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('title');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"title" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct slug posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ slug: 'slug-updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect slug posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ slug: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('slug');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"slug" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct avatar posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ avatar: 'avatar-updated.png' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect avatar posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ avatar: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('avatar');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"avatar" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct description posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ description: 'description-updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect description posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ description: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('description');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"description" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct content posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ content: 'content-updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect content posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ content: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('content');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"content" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct categories posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({
                    categories: [
                        {
                            id: 2,
                            name: 'trang điểm 2',
                            slug: 'trang-diem-2'
                        }
                    ]
                })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect categories posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ categories: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('categories');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"categories" must be an array');
                    console.log('ok');
                });
        });
        it('should update correct hashtag posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({
                    hashtag: [
                        'trang diem 1',
                        'make up 1'
                    ]
                })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect hashtag posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ hashtag: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('hashtag');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"hashtag" must be an array');
                    console.log('ok');
                });
        });
        it('should update correct is_display posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ is_display: true })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect is_display posts', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .send({ is_display: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('is_display');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"is_display" must be a boolean');
                    console.log('ok');
                });
        });
    });


    describe('DELETE /admin/v1/posts/:id', () => {
        it('should delete posts by id', async () => {
            const post = await Post.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .delete(`/admin/v1/posts/${post.id}`)
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    console.log('ok');
                });
        });
        it('should report error when delete posts but id not found', () => {
            return request(app)
                .delete('/admin/v1/posts/10000')
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.code).to.equal(404);
                    expect(res.body.message).to.equal('not_found');
                    console.log('ok');
                });
        });
        it('should report error when update a posts with id not a number', () => {
            return request(app)
                .delete('/admin/v1/posts/asdasdasd')
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then(res => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('id');
                    expect(location).to.be.equal('params');
                    expect(messages).to.include('"id" must be a number');
                    console.log('ok');
                });
        });
    });
});
