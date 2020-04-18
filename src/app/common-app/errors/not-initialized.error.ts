import { AppError } from './app.error';
export class NotInitialized extends AppError {
  constructor(entity: object) {
    super(entity.constructor.name + ' has not been initialized yet', [
      entity.constructor.name,
    ]);
  }
}
