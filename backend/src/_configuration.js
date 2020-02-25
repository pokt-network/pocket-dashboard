import express from 'express';
import cookieParser from "cookie-parser";
import logger from "morgan";

export function configureExpress(expressApp) {
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({extended: false}));
  expressApp.use(cookieParser());
  expressApp.use(logger('dev'));
}
