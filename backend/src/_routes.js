import index from './apis/index';


export function configureRoutes(expressApp) {
  expressApp.use('/', index);
}
