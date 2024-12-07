const generateRandomEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 12); // Random alphanumeric string
  const domains = ["example.com", "test.com", "email.com", "mock.com"];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${randomString}@${randomDomain}`;
};

export { generateRandomEmail };
