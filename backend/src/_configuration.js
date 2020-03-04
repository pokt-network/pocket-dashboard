import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from "dotenv";

// Configure Environment Variables: Now .env files can be loaded and used in process.env .
dotenv.config();

export const configurations = {
  persistence: {
    url: process.env.DATABASE_URL,
    dbName: process.env.DATABASE_NAME,
    options: {
      useUnifiedTopology: true
    }
  },
  poktNetwork: {
    url: process.env.POKT_NETWORK_URL
  }
};

export function configureExpress(expressApp) {
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({extended: false}));
  expressApp.use(cookieParser());
  expressApp.use(logger('dev'));
}
