import { HttpStatusCode } from 'axios';
import { Request, Router, Response, NextFunction } from 'express';
import { Session } from '../models/Session';
import { HttpError } from 'http-errors';
import { z } from "zod";

const router = Router();

const headersSchema = z.object({
    userid: z.string().min(1, "User ID is required in headers").uuid("User ID needs to be in UUID format")
})

const courseIdParamSchema = z.object({
    courseId: z.string().min(1, "Course ID is a required parameter").uuid("Course ID Needs to be in UUID format")
})

const sessionIdParamSchema = z.object({
    sessionId: z.string().min(1, "Session ID is a required parameter").uuid("Session ID Needs to be in UUID format")
})

// TODO: Standardise error structure
const validateHeaders = (schema: z.ZodSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationResult = schema.safeParse(req.headers)
        if (!validationResult.success) {
            res.status(HttpStatusCode.BadRequest).send({
                status: "error",
                message: "Validation error",
                errors: validationResult.error.errors
            })
        } else {
            req.headers = validationResult.data
            next()
        }
    }
}

const validateParameters = (schema: z.ZodSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationResult = schema.safeParse(req.params)
        if (!validationResult.success) {
            res.status(HttpStatusCode.BadRequest).send({
                status: "error",
                message: "Validation error",
                errors: validationResult.error.errors
            })
        } else {
            req.headers = validationResult.data
            next()
        }
    }
}

router.get('/:courseId', [validateHeaders(headersSchema), validateParameters(courseIdParamSchema)], async (req: Request<{ courseId: string }>, res: Response) => {
    try {
        const courseId = req.params.courseId
        const userId = req.headers['userid']

        const sessions = await Session.find({ courseId: courseId, userId: userId })

        const totalModulesStudied = sessions.reduce((acc, session) => acc + session.totalModulesStudied, 0)
        const totalScore = sessions.reduce((acc, session) => acc + session.averageScore, 0)
        const timeStudied = sessions.reduce((acc, session) => acc + session.timeStudied, 0)
        const averageScore = (totalScore / sessions.length) || 0

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


router.post('/:courseId', [validateHeaders(headersSchema), validateParameters(courseIdParamSchema)], async (req: Request<{ courseId: string }>, res: Response) => {
    try {
        const courseId = req.params.courseId
        const userId = req.headers['userid']
        const { sessionId, totalModulesStudied, averageScore, timeStudied } = req.body

        const session = new Session({
            _id: sessionId,
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

router.get('/:courseId/sessions/:sessionId', [validateHeaders(headersSchema), validateParameters(courseIdParamSchema), validateParameters(sessionIdParamSchema)], async (req: Request<{ courseId: string, sessionId: string }>, res: Response) => {
    try {
        const courseId = req.params.courseId
        const sessionId = req.params.sessionId
        const userId = req.headers['userid']

        const session = await Session.findOne({ courseId: courseId, userId: userId, _id: sessionId })

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