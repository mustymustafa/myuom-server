
import app from '../src/testServer';
import request from 'supertest'
import Middleware from '../src/middleware/Middleware'



//to fix trying to import a file a after jest tear down
jest.useFakeTimers()

//Test campus guide
describe('Test Campus ', () => {



    describe('Get campuses', () => {

        test("Should respond with status code 201 and contain locations object", async() => {

             const response = await request(app).get('/api/v1/locations')

            
              expect(response.statusCode).toBe(201)
              expect(JSON.parse(response.text).hasOwnProperty('locations')).toBe(true)
        })

})

})