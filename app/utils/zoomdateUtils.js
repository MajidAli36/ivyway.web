export function formatTimeUntil(date) {
  const now = new Date();
  const diffMs = date - now;

  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${
    remainingMinutes !== 1 ? "s" : ""
  }`;
}

export function convertTimeStringTo24Hour(timeStr) {
  if (!timeStr) return "00:00:00";

  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier && (modifier === "PM" || modifier === "pm")) {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}:00`;
}
