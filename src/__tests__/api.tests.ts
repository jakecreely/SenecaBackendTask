import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid'
import { getRandomInt } from '../utils';
import { DEFAULT_PORT } from '../config';
import { Server } from 'http'
import { connectToDB, disconnectFromDB } from '../db';
import { startServer, stopServer } from '..';
import axios from 'axios';
import 'dotenv/config'

// TODO: Add database testing
// TODO: Edge cases

const api = axios.create({
  baseURL: `http://localhost:${process.env.PORT || DEFAULT_PORT}`,
});

let server: Server | null = null

// TODO: Add test functions for initialising

beforeAll(async () => {
  try {
    server = startServer()
    await connectToDB()
  } catch (err) {
    console.log(err)
  }
})

afterAll(async () => {
  try {
    await stopServer(server)
    await disconnectFromDB()
  } catch (err) {
    console.log(err)
  }
})

describe("POST /courses/{courseId}", () => {
  test("Persists a session study event with valid inputs", async () => {
    // Parameters
    const userId = uuidv4();
    const courseId = uuidv4();

    // Request Body
    const sessionId = uuidv4();
    const totalModulesStudied = getRandomInt(50);
    const averageScore = getRandomInt(100);
    const timeStudied = getRandomInt(120);

    const response = await api.post(`/courses/${courseId}`, {
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

  test.todo("Fails because of server error")

  test.todo("Fails because of parameter error")

  test.todo("Fails because of header error")

})

// TODO: Create multiple sessions and check that the aggregation is working
describe("GET /course/{courseId}", () => {
  test('Retrieves lifetime stats for given course', async () => {
    // Parameters
    const userId = uuidv4();
    const courseId = uuidv4();

    // Request Body
    const sessionId = uuidv4();
    const totalModulesStudied = getRandomInt(50);
    const averageScore = getRandomInt(100);
    const timeStudied = getRandomInt(120);

    await api.post(`/courses/${courseId}`, {
      sessionId: sessionId,
      totalModulesStudied: totalModulesStudied,
      averageScore: averageScore,
      timeStudied: timeStudied
    }, {
      headers: {
        userid: userId
      }
    })

    const response = await api.get(`/courses/${courseId}`, {
      headers: {
        userid: userId
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

  test.todo("Fails because of server error")

  test.todo("Fails because of parameter error")

  test.todo("Fails because of header error")
})

describe("GET /courses/{courseId}/sessions/{sessionId}", () => {
  test("Gets stats for specific session in a course", async () => {
    // Parameters
    const userId = uuidv4();
    const courseId = uuidv4();
    const sessionId = uuidv4();

    // Request Body
    const totalModulesStudied = getRandomInt(50);
    const averageScore = getRandomInt(100);
    const timeStudied = getRandomInt(120);

    await api.post(`/courses/${courseId}`, {
      sessionId: sessionId,
      totalModulesStudied: totalModulesStudied,
      averageScore: averageScore,
      timeStudied: timeStudied
    }, {
      headers: {
        userId: userId
      }
    })

    const response = await api.get(`/courses/${courseId}/sessions/${sessionId}`, {
      headers: {
        userid: userId
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
  })

  test.todo("Fails because of server error")

  test.todo("Fails because of parameter error")

  test.todo("Fails because of header error")
})