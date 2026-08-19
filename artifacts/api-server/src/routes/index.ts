import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analyticsRouter from "./analytics";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analyticsRouter);
router.use(contactRouter);

export default router;
