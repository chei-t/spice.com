import bcrypt from 'bcryptjs';

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password with hash
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate salt
export const generateSalt = async () => {
  return await bcrypt.genSalt(10);
};

// Hash with custom salt
export const hashWithSalt = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};