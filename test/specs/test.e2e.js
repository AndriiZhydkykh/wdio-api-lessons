const { expect } = require('@wdio/globals')
const assert = require('node:assert').strict;

const axios = require('axios');

describe('Api testing', () => {
    it('get pet by id', async () => {
        await axios.get('https://petstore.swagger.io/v2/pet/200')
            .then(function (response) {
                console.log("our response is ", response) // print to console out response
                const petId = response.data.id
                assert.equal(petId, 200, `Expect 200 but got ${petId}`)
            })
    })
    it('get pet by id  - async/await method', async () => {
      const response = await axios.get('https://petstore.swagger.io/v2/pet/200')
      console.log("our response is ", response) // print to console out response
      const petId = response.data.id
      assert.equal(petId, 200, `Expect 200 but got ${petId}`)
    })
    it('get pet by not exist id', async () => {
        await axios.get('https://petstore.swagger.io/v2/pet/1') 
            .then(function (response) {
                const responseStatusCode = response.status 
                assert.equal(responseStatusCode, 404, `Expect status code 404 but get ${responseStatusCode}}`)
            })
            .catch(function (error) {
                if (error.response) {
                    const errorStatusCode = error.response.status
                    assert.equal(errorStatusCode, 404, `Expect status code 404 but got ${errorStatusCode}`) 
                    const responseBody = error.response.data 
                    const errorBody = { 
                        "code": 1,
                        "type": "error",
                        "message": "Pet not found"
                    }
                    assert.deepEqual(responseBody, errorBody, `Expect that response body will be equal error body but`)
                }
                else {
                    throw new Error(error.message)
                }

            })
    })
    it('get pet by not exist id try - catch - async/await method', async () => {
        try {
            const response = await axios.get('https://petstore.swagger.io/v2/pet/1');
            const responseStatusCode = response.status;
            assert.equal(responseStatusCode, 404, `Expect status code 404 but got ${responseStatusCode}`);
        
            const responseBody = response.data;
            const errorBody = {
                "code": 1,
                "type": "error",
                "message": "Pet not found"
            };
        
            assert.deepEqual(responseBody, errorBody, `Expect that response body will be equal error body but got ${JSON.stringify(responseBody)}`);
        } catch (error) {
            if (error.response) {
                const errorStatusCode = error.response.status;
                assert.equal(errorStatusCode, 404, `Expect status code 404 but got ${errorStatusCode}`);
                
                const responseBody = error.response.data;
                const errorBody = {
                    "code": 1,
                    "type": "error",
                    "message": "Pet not found"
                };
        
                assert.deepEqual(responseBody, errorBody, `Expect that response body will be equal error body but got ${JSON.stringify(responseBody)}`);
            } else {
                throw new Error(error.message);
            }
        }
    })
    it('get pet by status sold', async () => {
       const response = await axios.get('https://petstore.swagger.io/v2/pet/findByStatus',{
        params: new URLSearchParams({ status: ['sold'] })
       })
       assert.equal(response.status, 200,`Expect status 200 but got ${response.status}`)
       assert(response.data.some(pet => pet.status === "sold"),`Expect that response include sold status but not`)
       assert(!response.data.some(pet => pet.status === "available"),`Expect that response does not include available status but include`)
       assert(!response.data.some(pet => pet.status === "pending"),`Expect that response does not include pending status but include`)
    })
    it('get pet by status pending', async () => {
        const response = await axios.get('https://petstore.swagger.io/v2/pet/findByStatus',{
         params: new URLSearchParams({ status: ['pending'] })
        })
        assert.equal(response.status, 200,`Expect status 200 but got ${response.status}`)
        assert(response.data.some(pet => pet.status === "pending"),`Expect that response include pending status but not`)
        assert(!response.data.some(pet => pet.status === "available"),`Expect that response does not include available status but include`)
        assert(!response.data.some(pet => pet.status === "sold"),`Expect that response does not include sold status but include`)
    })
    it('get pet by status available', async () => {
        const response = await axios.get('https://petstore.swagger.io/v2/pet/findByStatus',{
         params: new URLSearchParams({ status: ['available'] })
        })
        assert.equal(response.status, 200,`Expect status 200 but got ${response.status}`)
        assert(response.data.some(pet => pet.status === "available"),`Expect that response include available status but not`)
        assert(!response.data.some(pet => pet.status === "sold"),`Expect that response does not include sold status but include`)
        assert(!response.data.some(pet => pet.status === "pending"),`Expect that response does not include pending status but include`)
    })
    it('get pet by status sold', async () => {
        const response = await axios.get('https://petstore.swagger.io/v2/pet/findByStatus',{
         params: new URLSearchParams({ status: ['sold','pending'] })
        })
        assert.equal(response.status, 200,`Expect status 200 but got ${response.status}`)
        assert(response.data.some(pet => pet.status === "sold"),`Expect that response include sold status but not`)
        assert(response.data.some(pet => pet.status === "pending"),`Expect that response include pending status but not`)
        assert(!response.data.some(pet => pet.status === "available"),`Expect that response does not include available status but include`)
     })
})

