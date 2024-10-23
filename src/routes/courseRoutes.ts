import { HttpStatusCode } from 'axios';
import { Request, Router, Response } from 'express';

const router = Router();

router.get('/:courseId', async (req: Request<{courseId: string}>, res: Response) => {
    // Add check if userId in request headers
    
    res.status(HttpStatusCode.Ok).send()
})


router.post('/:courseId', async (req: Request<{courseId: string}>, res: Response) => {
    res.status(HttpStatusCode.Created).send()
})

router.get('/:courseId/sessions/:sessionId', async (req: Request<{courseId: string, sessionId: string}>, res: Response) => {
    // Add check if userId in request headers
    
    res.status(HttpStatusCode.Ok).send()
})

export default router