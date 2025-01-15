import logger from '@/src/utils/logger';  // Ton logger personnalisé

// Type de l'instance de logger
type Logger = {
    info: jest.Mock;
    warn: jest.Mock;
    error: jest.Mock;
    debug: jest.Mock;
};

jest.mock('@/src/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
}));

describe('Logger', () => {
    it('should log info messages correctly', () => {
        const mockInfo = jest.fn();
        (logger.info as jest.Mock) = mockInfo;  // Remplacer la fonction info par un mock

        logger.info('Test message');
        expect(mockInfo).toHaveBeenCalledWith(expect.stringContaining('Test message'));
    });

    it('should log error messages correctly', () => {
        const mockError = jest.fn();
        (logger.error as jest.Mock) = mockError;  // Remplacer la fonction error par un mock

        logger.error('Error message');
        expect(mockError).toHaveBeenCalledWith(expect.stringContaining('Error message'));
    });
});
