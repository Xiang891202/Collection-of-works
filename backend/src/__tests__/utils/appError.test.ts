import { AppError } from '../../utils/appError';

describe('AppError', () => {
  it('應建立正確的錯誤物件', () => {
    const error = new AppError('Something went wrong', 400);
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });
});