
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

describe('Forui', () => {

    
})

})