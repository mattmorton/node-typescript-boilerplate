import { hashPassword, comparePassword } from './encryption'

describe('encryption unit tests', () => {
  const testPlainCorrectPassword = 'password';
  const testPlainIncorrectPassword = 'incorrect';
  const testEmail = 'tester@test.com';

  describe('hashing a password', async () => {

    it('should be a string', async() => {
      const hashedPassword = await hashPassword(testPlainCorrectPassword);
      expect(typeof hashedPassword).toEqual('string');
    })

    it('should be different to the plain password', async () => {
      const hashedPassword = await hashPassword(testPlainCorrectPassword);
      expect(hashedPassword).not.toEqual(testPlainCorrectPassword);
    })
  })

  describe('comparing a password', async () => {
    
    it('should return true for matching password', async () => {
      const hashedPassword = await hashPassword(testPlainCorrectPassword);
      const comparedPassword = await comparePassword(testPlainCorrectPassword, hashedPassword);
      expect(comparedPassword).toBe(true)
    })

    it('should return false for not matching password', async () => {
      const hashedPassword = await hashPassword(testPlainCorrectPassword);
      const comparedPassword = await comparePassword(testPlainIncorrectPassword, hashedPassword); 
      expect(comparedPassword).toBe(false);
    })
  })

})