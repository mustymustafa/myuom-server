
import server from '../src/index';

describe('Test server connection', () => {
    it('is server running?', () => {
        expect(server().toEqual('server running on .....8080'))
    })
})