import { HttpStatusCode } from 'axios';
import { Request, Router, Response } from 'express';
import { ISession, Session } from '../models/Session';
import { HttpError } from 'http-errors';

const router = Router();

router.get('/:courseId', async (req: Request<{courseId: string}>, res: Response) => {
    try {
        const courseId = req.params.courseId
        const userId = req.headers['userid']

        const sessions = await Session.find({courseId: courseId, userId: userId})

        const totalModulesStudied = sessions.reduce((acc, session) => acc + session.totalModulesStudied, 0)
        const totalScore = sessions.reduce((acc, session) => acc + session.averageScore, 0)
        const timeStudied = sessions.reduce((acc, session) => acc + session.timeStudied, 0)

        const averageScore = totalScore / sessions.length // Could be null
        res.status(HttpStatusCode.Ok).send({
            totalModulesStudied,
            averageScore,
            timeStudied
        })
    } catch (err) {
        if (err instanceof HttpError) {
            res.status(err.status).send(err.message)
        } else {
            res.status(HttpStatusCode.InternalServerError).send((err as Error).message)
        }
    }
})


router.post('/:courseId', async (req: Request<{courseId: string}, {}, ISession>, res: Response) => {
    try {
        const courseId = req.params.courseId
        const userId = req.headers['userid']
        const { totalModulesStudied, averageScore, timeStudied} = req.body

        const session = new Session({
            courseId,
            userId,
            totalModulesStudied,
            averageScore,
            timeStudied
        })

        await session.save()
        
        res.status(HttpStatusCode.Created).send()
    } catch (err) {
        if (err instanceof HttpError) {
            res.status(err.status).send(err.message)
        } else {
            res.status(HttpStatusCode.InternalServerError).send((err as Error).message)
        }
    }
    
    res.status(HttpStatusCode.Created).send()
})

router.get('/:courseId/sessions/:sessionId', async (req: Request<{courseId: string, sessionId: string}>, res: Response) => {
    try {
        const courseId = req.params.courseId
        const sessionId = req.params.sessionId
        const userId = req.headers['userid']

        const session = await Session.findOne({courseId: courseId, userId: userId, _id: sessionId})
        
        res.status(HttpStatusCode.Ok).send({
            sessionId: session._id,
            totalModulesStudied: session.totalModulesStudied,
            averageScore: session.averageScore,
            timeStudied: session.timeStudied
        })
    } catch (err) {
        if (err instanceof HttpError) {
            res.status(err.status).send(err.message)
        } else {
            res.status(HttpStatusCode.InternalServerError).send((err as Error).message)
        }
    }
})

export default router