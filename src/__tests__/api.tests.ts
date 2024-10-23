import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { v4 as uuidv4} from 'uuid'
import { getRandomInt } from '../utils';
import axios from 'axios';

beforeAll(async () => {
  try {
    // Init Test DB
    // Start Server
  } catch (err) {
    console.log(err)
  }
})

afterAll(async () => {
  try {
    // Stop Test DB
    // Stop Server
  } catch (err) {
    console.log(err)
  }
})

describe("POST /courses/{courseId}", () => {
  test("Successfully persists a session study event with valid inputs", async () => {
    // Parameters
    const userId = uuidv4();
    const courseId = uuidv4();

    // Request Body
    const sessionId = uuidv4();
    const totalModulesStudied = getRandomInt(50);
    const averageScore = getRandomInt(100);
    const timeStudied = getRandomInt(120);

    const response = await axios.post(`http://localhost:8080/courses/${courseId}`, {
      sessionId: sessionId,
      totalModulesStudied: totalModulesStudied,
      averageScore: averageScore,
      timeStudied: timeStudied
    }, {
      headers: {
        userId: userId
      }
    })

    expect(response.status).toBe(axios.HttpStatusCode.Created)
  })
})

describe("GET /course/{courseId}", () => {
  test('Success', async () => {
    // Parameters
    const userId = uuidv4();
    const courseId = uuidv4();
    
    // Request Body
    const sessionId = uuidv4();
    const totalModulesStudied = getRandomInt(50);
    const averageScore = getRandomInt(100);
    const timeStudied = getRandomInt(120);

    await axios.post(`http://localhost:8080/courses/${courseId}`, {
      sessionId: sessionId,
      totalModulesStudied: totalModulesStudied,
      averageScore: averageScore,
      timeStudied: timeStudied
    }, {
      headers: {
        userId: userId
      }
    })

    const response = await axios.get(`http://localhost:8080/courses/${courseId}`, {
      headers: {
        userId: userId
      }
    })

    expect(response.data).toHaveProperty('totalModulesStudied')
    expect(response.data).toHaveProperty('averageScore')
    expect(response.data).toHaveProperty('timeStudied')
    expect(response.data.totalModulesStudied).toBe(totalModulesStudied)
    expect(response.data.averageScore).toBe(averageScore)
    expect(response.data.timeStudied).toBe(timeStudied)
    expect(response.status).toBe(axios.HttpStatusCode.Ok)
  })
})

describe("GET /courses/{courseId}/sessions/{sessionId}", () => {
  test("Success", async () => {
    try {
    // Parameters
    const userId = uuidv4();
    const courseId = uuidv4();
    const sessionId = uuidv4();

    // Request Body
    const totalModulesStudied = getRandomInt(50);
    const averageScore = getRandomInt(100);
    const timeStudied = getRandomInt(120);

    await axios.post(`http://localhost:8080/courses/${courseId}`, {
      sessionId: sessionId,
      totalModulesStudied: totalModulesStudied,
      averageScore: averageScore,
      timeStudied: timeStudied
    }, {
      headers: {
        userId: userId
      }
    })

    const response = await axios.get(`http://localhost:8080/courses/${courseId}/sessions/${sessionId}`, {
      headers: {
        userId: userId
      }
    })

    expect(response.data).toHaveProperty('sessionId')
    expect(response.data).toHaveProperty('totalModulesStudied')
    expect(response.data).toHaveProperty('averageScore')
    expect(response.data).toHaveProperty('timeStudied')
    expect(response.data.sessionId).toBe(sessionId)
    expect(response.data.totalModulesStudied).toBe(totalModulesStudied)
    expect(response.data.averageScore).toBe(averageScore)
    expect(response.data.timeStudied).toBe(timeStudied)
    expect(response.status).toBe(axios.HttpStatusCode.Ok)
  } catch (err) {
    console.log(err)
  }
  })
  
})