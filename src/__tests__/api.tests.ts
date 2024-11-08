import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid'
import { getRandomInt } from '../utils';
import { DEFAULT_PORT } from '../config';
import { Server } from 'http'
import { connectToDB, disconnectFromDB } from '../db';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import 'dotenv/config'
import { startServer, stopServer } from '../server';

const api = axios.create({
  baseURL: `http://localhost:${process.env.PORT || DEFAULT_PORT}`,
});

let server: Server | null = null

beforeAll(async () => {
  try {
    server = await startServer()
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
    const courseId = uuidv4();

    const userId = uuidv4();

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

  test("Should return bad request status when userid is missing from header", async () => {
    try {
      // Parameters
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
        }
      })

      expect(response.status).toBe(HttpStatusCode.BadRequest)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(axios.HttpStatusCode.BadRequest)
      } else {
        throw err
      }
    }
  })

  test("Should return bad request status when sessionId is missing from body", async () => {
    try {
      // Parameters
      const courseId = uuidv4();

      const userId = uuidv4();

      // Request Body
      const totalModulesStudied = getRandomInt(50);
      const averageScore = getRandomInt(100);
      const timeStudied = getRandomInt(120);

      const response = await api.post(`/courses/${courseId}`, {
        totalModulesStudied: totalModulesStudied,
        averageScore: averageScore,
        timeStudied: timeStudied
      }, {
        headers: {
          userid: userId
        }
      })

      expect(response.status).toBe(HttpStatusCode.BadRequest)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(axios.HttpStatusCode.BadRequest)
      } else {
        throw err
      }
    }
  })

  test("Should return bad request status when totalModulesStudied is missing from body", async () => {
    try {
      // Parameters
      const courseId = uuidv4();

      const userId = uuidv4();

      // Request Body
      const sessionId = uuidv4();
      //const totalModulesStudied = getRandomInt(50);
      const averageScore = getRandomInt(100);
      const timeStudied = getRandomInt(120);

      const response = await api.post(`/courses/${courseId}`, {
        sessionId: sessionId,
        averageScore: averageScore,
        timeStudied: timeStudied
      }, {
        headers: {
          userid: userId
        }
      })

      expect(response.status).toBe(HttpStatusCode.BadRequest)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(axios.HttpStatusCode.BadRequest)
      } else {
        throw err
      }
    }
  })

  test("Should return bad request status when averageScore is missing from body", async () => {
    try {
      // Parameters
      const courseId = uuidv4();

      const userId = uuidv4();

      // Request Body
      const sessionId = uuidv4();
      const totalModulesStudied = getRandomInt(50);
      //const averageScore = getRandomInt(100);
      const timeStudied = getRandomInt(120);

      const response = await api.post(`/courses/${courseId}`, {
        sessionId: sessionId,
        totalModulesStudied: totalModulesStudied,
        timeStudied: timeStudied
      }, {
        headers: {
          userid: userId
        }
      })

      expect(response.status).toBe(HttpStatusCode.BadRequest)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(axios.HttpStatusCode.BadRequest)
      } else {
        throw err
      }
    }
  })

  test("Should return bad request status when timeStudied is missing from body", async () => {
    try {
      // Parameters
      const courseId = uuidv4();

      const userId = uuidv4();

      // Request Body
      const sessionId = uuidv4();
      const totalModulesStudied = getRandomInt(50);
      const averageScore = getRandomInt(100);
      //const timeStudied = getRandomInt(120);

      const response = await api.post(`/courses/${courseId}`, {
        sessionId: sessionId,
        totalModulesStudied: totalModulesStudied,
        averageScore: averageScore
      }, {
        headers: {
          userid: userId
        }
      })

      expect(response.status).toBe(HttpStatusCode.BadRequest)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(axios.HttpStatusCode.BadRequest)
      } else {
        throw err
      }
    }
  })


  test("Should return conflict status when creating session with an existing ID", async () => {
    // Parameters
    const courseId = uuidv4();

    // Headers
    const userId = uuidv4();

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

    try {
      const response = await api.post(`/courses/${courseId}`, {
        sessionId: sessionId,
        totalModulesStudied: totalModulesStudied,
        averageScore: averageScore,
        timeStudied: timeStudied
      }, {
        headers: {
          userid: userId
        }
      })

      // Fallback incase no error is thrown
      expect(response.status).toBe(HttpStatusCode.Conflict)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(HttpStatusCode.Conflict)
      } else {
        throw err
      }
    }
  })

  test("Should return bad request status if totalModulesStudied is less than 0", async () => {
    try {
      // Parameters
      const courseId = uuidv4();

      const userId = uuidv4();

      // Request Body
      const sessionId = uuidv4();
      const totalModulesStudied = -1;
      const averageScore = getRandomInt(100);
      const timeStudied = getRandomInt(120);

      const response = await api.post(`/courses/${courseId}`, {
        sessionId: sessionId,
        totalModulesStudied: totalModulesStudied,
        averageScore: averageScore,
        timeStudied: timeStudied
      }, {
        headers: {
          userid: userId
        }
      })

      expect(response.status).toBe(HttpStatusCode.BadRequest)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(axios.HttpStatusCode.BadRequest)
      } else {
        throw err
      }
    }
  })

  test("Should return bad request status if averageScore is less than 0", async () => {
    try {
      // Parameters
      const courseId = uuidv4();

      const userId = uuidv4();

      // Request Body
      const sessionId = uuidv4();
      const totalModulesStudied = getRandomInt(50);
      const averageScore =  -1;
      const timeStudied = getRandomInt(120);

      const response = await api.post(`/courses/${courseId}`, {
        sessionId: sessionId,
        totalModulesStudied: totalModulesStudied,
        averageScore: averageScore,
        timeStudied: timeStudied
      }, {
        headers: {
          userid: userId
        }
      })

      expect(response.status).toBe(HttpStatusCode.BadRequest)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(axios.HttpStatusCode.BadRequest)
      } else {
        throw err
      }
    }
  })

  test("Should return bad request status if timeStudied is less than 0", async () => {
    try {
      // Parameters
      const courseId = uuidv4();

      const userId = uuidv4();

      // Request Body
      const sessionId = uuidv4();
      const totalModulesStudied = getRandomInt(50);
      const averageScore =  getRandomInt(100)
      const timeStudied = -1;

      const response = await api.post(`/courses/${courseId}`, {
        sessionId: sessionId,
        totalModulesStudied: totalModulesStudied,
        averageScore: averageScore,
        timeStudied: timeStudied
      }, {
        headers: {
          userid: userId
        }
      })

      expect(response.status).toBe(HttpStatusCode.BadRequest)

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        expect(err.response.status).toBe(axios.HttpStatusCode.BadRequest)
      } else {
        throw err
      }
    }
  })

  test.todo("Should return bad request status for invalid UUID type for sessionId")

  test.todo("Should return bad request status for invalid UUID type for userId")

  test.todo("Should return bad request status for invalid number type for other body variables")

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