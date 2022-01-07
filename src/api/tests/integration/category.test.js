/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
import { Op } from 'sequelize';
import request from 'supertest';
import httpStatus from 'http-status';
import { expect } from 'chai';
import { omit } from 'lodash';
import app from '../../../index';
import Category from '../../../common/models/post-category.model';

const token = process.env.BEARER_TOKEN;
describe('category API', async () => {
    let records;
    let newRecord;

    beforeEach(async () => {
        records = [
            {
                name: 'Trang diem',
                note: 'trang diem mat',
                slug: 'trang-diem',
                logo: 'logo1',
                image: 'image1'
            },
            {
                name: 'Trang diem 2',
                note: 'trang diem mat 2',
                slug: 'trang-diem-2',
                logo: 'logo2',
                image: 'image2'
            },
            {
                name: 'Trang diem 3',
                note: 'trang diem mat 3',
                slug: 'trang-diem-3',
                logo: 'logo3',
                image: 'image3'
            },
        ];
        newRecord = {
            name: 'Trang diem 7',
            note: 'trang diem mat 7',
            slug: 'trang-diem-7',
            logo: 'logo7',
            image: 'image7'
        };

        await Category.destroy({
            where: { id: { [Op.ne]: null } }
        });

        await Category.bulkCreate(records);
    });

    describe('GET /admin/v1/post-categories/:id', () => {
        it('should get category by id', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .get(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    console.log('ok');
                });
        });
        it('should report error when id not found', () => {
            return request(app)
                .get('/admin/v1/post-categories/999999999')
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.code).to.equal(404);
                    expect(res.body.message).to.equal('not_found');
                    console.log('ok');
                });
        });
    });

    describe('GET /admin/v1/post-categories', () => {
        it('should get all categories', () => {
            return request(app)
                .get('/admin/v1/post-categories')
                .set('Authorization', token)
                .query({ limit: 20 })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(3);
                    console.log('ok');
                });
        });
        it('should get all categories with skip and limit', () => {
            return request(app)
                .get('/admin/v1/post-categories')
                .set('Authorization', token)
                .query({ skip: 2, limit: 20 })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(1);
                    console.log('ok');
                });
        });
        it('should report error when skip is not a number', () => {
            return request(app)
                .get('/admin/v1/post-categories')
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
                .get('/admin/v1/post-categories')
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
        it('should get all categories with parmas keyword: trang diem', () => {
            return request(app)
                .get('/admin/v1/post-categories')
                .set('Authorization', token)
                .query({ keyword: records[1].name })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(1);
                    console.log('ok');
                });
        });
        it('should get all categories with params id', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .get('/admin/v1/post-categories')
                .set('Authorization', token)
                .query({ id: category.id })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(1);
                    console.log('ok');
                });
        });
        it('should get all categories with params is_active = true', async () => {
            return request(app)
                .get('/admin/v1/post-categories')
                .set('Authorization', token)
                .query({ is_active: true, limit: 20 })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(3);
                    console.log('ok');
                });
        });
    });


    describe('POST /admin/v1/post-categories', () => {
        it('should create a new category when request is ok', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .post('/admin/v1/post-categories')
                .set('Authorization', token)
                .send(Object.assign(newRecord, { parent_id: category.id }))
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    console.log('ok');
                });
        });
        it('should report error when required fields is not provided', () => {
            const requiredFields = ['name', 'slug'];
            newRecord = omit(newRecord, requiredFields);
            return request(app)
                .post('/admin/v1/post-categories')
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
        it('should create a new category and set default values', async () => {
            const defaultValues = [
                'note',
                'logo',
                'image',
                'path',
                'parent_id',
                'normalize_path',
                'is_active'
            ];
            newRecord = omit(
                newRecord, defaultValues
            );
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .post('/admin/v1/post-categories')
                .set('Authorization', token)
                .send(Object.assign(newRecord, { parent_id: category.id }))
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


    describe('PUT /admin/v1/post-categories/:id', () => {
        it('should report error when update not found a category ', () => {
            return request(app)
                .put('/admin/v1/post-categories/99999999')
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
        it('should update correct name category', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .send({ name: 'name updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect name category', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .send({ name: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('name');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"name" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct note category', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .send({ note: 'note updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect note category', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .send({ note: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('note');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"note" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct logo category', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .send({ logo: 'logo updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect logo category', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .send({ logo: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('logo');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"logo" must be a string');
                    console.log('ok');
                });
        });
        it('should update correct image category', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .send({ image: 'image updated' })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.code).to.equal(0);
                    expect(res.body.message).to.equal('update_success');
                    console.log('ok');
                });
        });
        it('should report error when incorrect image category', async () => {
            const category = await Category.findOne({
                order: [
                    ['created_at', 'desc']
                ]
            });
            return request(app)
                .put(`/admin/v1/post-categories/${category.id}`)
                .set('Authorization', token)
                .send({ image: {} })
                .expect('Content-Type', /json/)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { field, location, messages } = res.body.errors[0];
                    expect(res.body.code).to.be.equal(400);
                    expect(field).to.be.equal('image');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('"image" must be a string');
                    console.log('ok');
                });
        });
    });
});
