export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);

  const thaiTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return thaiTime.toLocaleTimeString("en-EN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Bangkok",
  });
};

export const getCurrentFormatTime = (): string => {
  const now = new Date();
  const thaiTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
  );
  return thaiTime.toISOString();
};
