
import app from '../src/index';
import request from 'supertest'
import Middleware from '../src/middleware/Middleware'



//to fix trying to import a file a after jest tear down
jest.useFakeTimers()

//Test Authtnetication
describe('Test Authentication', () => {

    describe('Given an email and password', () => {
        //should respond with a status code 200
        test("Should respond with status code 200", async() => {

            const response = await request(app).post("/api/v1/signin", Middleware.signinMiddleware).send({
                email: 'musty@postgrad.manchester.ac.uk',
                password: 'musty100'
            })

            expect(response.statusCode).toBe(200)
        })

             //should respond with a token (nonce)
                test("Should respond with a token/nonce", async() => {

            const response = await request(app).post("/api/v1/signin", Middleware.signinMiddleware).send({
                email: 'musty@postgrad.manchester.ac.uk',
                password: 'musty100'
            })

            
            //expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))

            expect(JSON.parse(response.text).hasOwnProperty('token')).toBe(true)
    
        })
             

})

    describe('Given a wrong email or password', () => {
        //should respond with a status code 403
        test("Should respond with status code 401 or 403", async() => {

            const response = await request(app).post("/api/v1/signin", Middleware.signinMiddleware).send({
                email: 'musty@postgrad.manchester.ac.uk',
                password: 'musty10'
            })

            expect(response.statusCode).toBe(403 || 401)
        })

})

})