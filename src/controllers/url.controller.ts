import { publicProcedure } from "../routers/trpc/context";
import { z } from "zod";
import {UrlService} from "../services/url.service";
import logger from "../config/logger.config";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors/app.error";
import { UrlRepository } from "../repositories/url.repository";
import { CacheRepository } from "../repositories/cache.repository";
import { Request, Response, NextFunction } from "express";

const urlService=new UrlService(new UrlRepository(), new CacheRepository());
export const urlController={
    
    create: publicProcedure
    .input(
        z.object({
            originalUrl:z.string().url('Invalid URL')
        })
    )
    .mutation(async ({input}) => {
        try{
      const result= await urlService.createShortUrl(input.originalUrl);
      return result;
        }catch(error){
            logger.error('Error creating short URL', error);
            throw new InternalServerError('Failed creating short URL');

        }
    }),
    getOriginalUrl: publicProcedure
    .input(
        z.object({
            shortUrl: z.string().min(1, 'Short URL is required')
        })
    )
    .query(async ({input}) => {
        try{
            const result = await urlService.getOriginalUrl(input.shortUrl);
            return result;
        }catch(error){
            logger.error('Error retrieving original URL', error);
            throw new InternalServerError('Failed retrieving original URL');
        }
    }),
}

export async function redirectUrl(req:Request, res:Response,next:NextFunction){
   try{
    const {shortUrl}=req.params;

    if (!shortUrl || typeof shortUrl !== 'string' || shortUrl.trim().length === 0){
        throw new BadRequestError('Short URL parameter is required and must be valid');
    }
    // Get Original Url

    const url = await urlService.getOriginalUrl(shortUrl.trim());

    if(!url || !url.originalUrl){
        throw new NotFoundError('URL not found');
    }
    // redirect to original url
    return res.redirect(url.originalUrl);
    
   }catch(error){
    next(error);
   }
}