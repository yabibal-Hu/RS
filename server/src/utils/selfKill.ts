// utils/selfKill.ts
export const setupSelfKill = (maxIdleTime: number = 300000) => {
  // 5 minutes default
  let lastRequestTime = Date.now();

  // Update on each request
  const updateLastRequest = () => {
    lastRequestTime = Date.now();
  };

  // Check idle time periodically
  setInterval(() => {
    const idleTime = Date.now() - lastRequestTime;

    if (idleTime > maxIdleTime) {
      console.log(
        `Process ${process.pid} idle for ${idleTime}ms, killing self`,
      );
      process.exit(0); // Graceful exit
    }
  }, 60000); // Check every minute

  return updateLastRequest;
};


