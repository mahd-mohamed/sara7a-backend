import { globalErrorHandler } from "./utils/index.js";
import {connectDB} from "./DB/index.js";
import * as appRoutes from "./modules/index.js";
import rateLimit from "express-rate-limit";
import config from "../config/dev.config.js";
import cors from "cors";

export default function bootstrap(app, express) {

    // CORS configuration
    app.use(cors({
        origin: ['http://localhost:4200', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'refreshtoken']
    }));

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 50, // limit each IP to 50 requests per windowMs
        handler: (req, res, next, options) => {
            throw new Error(options.message, { cause: options.statusCode });
        }
    });

    app.use(apiLimiter);
    
    app.use(express.json());
    app.use("/uploads", express.static("uploads"));

    connectDB(config.DB_URI);

    //Routes
    app.use("/auth", appRoutes.authRouter);
    app.use("/user", appRoutes.userRouter);
    app.use("/message", appRoutes.messageRouter);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    //global error handler
    app.use(globalErrorHandler);

}