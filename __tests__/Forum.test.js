
import app from '../src/testServer';
import request from 'supertest'


describe('Test Forum operations', () => {

    describe('Test adding a post', () => {

    test('Should respond with Post added successfully', async () => {
        const response = await request(app).post('/api/v1/post').send({
        uid: '60c1d5d5a1527900154fec88',
        post: 'unit test',
        level: 'Postgraduate',
        dept: 'Computer Science'
    })

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.text).message).toBe('Post added successfully')

    })
    
})

describe('Test adding a comment to a post', () => {

      test('Should respond with Comment added successfully', async () => {
        const response = await request(app).post('/api/v1/comment').send({
        uid: '60c1d5d5a1527900154fec88',
        pid: '60e0f1ac54c533261adf2001',
        comment: 'unit test comment',
    })

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.text).message).toBe('comment added successfully')

    })
    
})

})