import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import newsRouter from "./news";
import galleryRouter from "./gallery";
import storageRouter from "./storage";
import videosRouter from "./videos";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(newsRouter);
router.use(galleryRouter);
router.use(storageRouter);
router.use(videosRouter);

export default router;
