import { NextFunction, Request, Response } from "express"; // Import necessary types from Express
import { ZodError } from "zod"; // Import ZodError from Zod library for validation errors
import { ResponseError } from "../error/response-error"; // Import custom ResponseError class for handling response errors

/**
 * Middleware function to handle errors in the application.
 * 
 * @param {Error} error - The error object thrown in the application.
 * @param {Request} req - The Express request object containing the HTTP request.
 * @param {Response} res - The Express response object to send the HTTP response.
 * @param {NextFunction} next - The Express next function to pass control to the next middleware.
 */
export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: `Validation Error: ${JSON.stringify(error)}`
        });
    // Handle custom response errors
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message
        });
    // Handle other types of errors
    } else {
        res.status(500).json({
            errors: error.message
        });
    }
}