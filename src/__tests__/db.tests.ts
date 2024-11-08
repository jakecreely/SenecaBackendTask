import { afterAll, afterEach, beforeAll, describe, expect, test } from "@jest/globals";
import { v4 as uuidv4 } from 'uuid'
import mongoose, { Mongoose } from 'mongoose';
import { MongoMemoryServer } from "mongodb-memory-server";

import { Session } from "../models/Session";
import { getRandomInt } from "../utils";

describe('Session Model Tests', () => {
    let connection: MongoMemoryServer;
    let db: Mongoose;

    beforeAll(async () => {
        connection = await MongoMemoryServer.create();
        const uri = connection.getUri();

        db = await mongoose.connect(uri);
    });

    afterEach(async () => {
        await Session.deleteMany({});
    });

    afterAll(async () => {
        await db.disconnect()
        await connection.stop()
    });

    test('Should create and save a new session successfully', async () => {
        const courseId = uuidv4()
        const userId = uuidv4()
        const totalModulesStudied = getRandomInt(50);
        const averageScore = getRandomInt(100);
        const timeStudied = getRandomInt(120);

        const validSession = new Session({
            courseId: courseId,
            userId: userId,
            totalModulesStudied: totalModulesStudied,
            averageScore: averageScore,
            timeStudied: timeStudied,
        });

        const savedSession = await validSession.save();

        expect(savedSession._id).toBeDefined();
        expect(savedSession.courseId).toBe(courseId);
        expect(savedSession.userId).toBe(userId);
        expect(savedSession.totalModulesStudied).toBe(totalModulesStudied);
        expect(savedSession.averageScore).toBe(averageScore);
        expect(savedSession.timeStudied).toBe(timeStudied);
    });

    test('Should retrieve the correct session by courseId, userId and sessionId', async () => {
        const courseId = uuidv4()
        const userId = uuidv4()
        const totalModulesStudied = getRandomInt(50);
        const averageScore = getRandomInt(100);
        const timeStudied = getRandomInt(120);

        const validSession = new Session({
            courseId: courseId,
            userId: userId,
            totalModulesStudied: totalModulesStudied,
            averageScore: averageScore,
            timeStudied: timeStudied,
        });

        const savedSession = await validSession.save();

        const foundSession = await Session.findOne({
            _id: savedSession._id,
            courseId: validSession.courseId,
            userId: validSession.userId,
        });

        expect(foundSession).toBeDefined();
        expect(foundSession.courseId).toBe(courseId)
        expect(foundSession.userId).toBe(userId)
        expect(foundSession.totalModulesStudied).toBe(totalModulesStudied);
        expect(foundSession.averageScore).toBe(averageScore);
        expect(foundSession.timeStudied).toBe(timeStudied);
    });

    test('Should retrieve the correct sessions by courseId', async () => {
        const noOfSessions = 5
        const courseId = uuidv4()
        const savedSessions = []

        for (let i = 0; i < noOfSessions; i++) {
            const userId = uuidv4()
            const totalModulesStudied = getRandomInt(50);
            const averageScore = getRandomInt(100);
            const timeStudied = getRandomInt(120);

            const validSession = new Session({
                courseId: courseId,
                userId: userId,
                totalModulesStudied: totalModulesStudied,
                averageScore: averageScore,
                timeStudied: timeStudied,
            });

            const saveSession = await new Session(validSession).save();
            savedSessions.push(saveSession)
        }

        const foundSessions = await Session.find({
            courseId: courseId
        });

        expect(foundSessions.length).toBe(noOfSessions);

        foundSessions.forEach((session, index) => {
            const originalSession = savedSessions[index];
    
            expect(session.courseId).toBe(originalSession.courseId);
            expect(session.userId).toBe(originalSession.userId);
            expect(session.totalModulesStudied).toBe(originalSession.totalModulesStudied);
            expect(session.averageScore).toBe(originalSession.averageScore);
            expect(session.timeStudied).toBe(originalSession.timeStudied);
        });
    
    });

    test('Should retrieve the correct session by userId and sessionId', async () => {
        const courseId = uuidv4()
        const userId = uuidv4()
        const totalModulesStudied = getRandomInt(50);
        const averageScore = getRandomInt(100);
        const timeStudied = getRandomInt(120);

        const validSession = new Session({
            courseId: courseId,
            userId: userId,
            totalModulesStudied: totalModulesStudied,
            averageScore: averageScore,
            timeStudied: timeStudied,
        });

        const savedSession = await validSession.save();

        const foundSession = await Session.findOne({
            courseId: savedSession.courseId,
            userId: savedSession.userId,
        });

        expect(foundSession._id).toBeDefined();
        expect(foundSession.courseId).toBe(courseId)
        expect(foundSession.userId).toBe(userId)
        expect(foundSession.totalModulesStudied).toBe(totalModulesStudied);
        expect(foundSession.averageScore).toBe(averageScore);
        expect(foundSession.timeStudied).toBe(timeStudied);
    });
});