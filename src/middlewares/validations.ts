import { Request, Response, NextFunction} from 'express';

export function checkType(request: Request, response: Response, next: NextFunction) {
	if(!isString(request.params.pair)){
		console.log("boolean: ", !isString(request.params.pair))
		next(request)
	}
	next()
}

const isString = (value: string) => {
  return value && typeof value === 'string';
}

export function checkParams(request: Request, response: Response, next: NextFunction) {
	const {pair, opType, amount} = request.params
	if(!isString(pair) && !isString(opType) && !isString(amount)) {
		next(request)
	}
	next()
}