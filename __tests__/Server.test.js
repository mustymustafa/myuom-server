
import app from '../src/index';
import request from 'supertest'



//to fix trying to import a file a after jest tear down
jest.useFakeTimers()

//Test Authtnetication
describe('Test Authentication', () => {

    describe('Given an email and password', () => {
        //should respind with a token
        //should respond with a status code 200
 
        test("Should respond with status code 200", async() => {

            const response = await request(app).post("/api/v1/signin").send({
                email: 'musty@postgrad.manchester.ac.uk',
                password: 'musty10'
            })
        })
    

})

    describe('Given a wrong email or password', () => {
    

})

})