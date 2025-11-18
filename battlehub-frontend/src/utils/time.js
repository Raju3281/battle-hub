 const parseDate = (value) => {
  if (!value) return null;

  if (!isNaN(Number(value))) {
    const num = Number(value);
    const ms = num.toString().length === 10 ? num * 1000 : num;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(value);
  if (!isNaN(d.getTime())) return d;

  return null;
};

export const getTimeDate = (matchTime) => {
    const FIVE_HOURS_30_MIN = 5.5 * 60 * 60 * 1000;  // 5h 30m
    const matchDate = parseDate(matchTime)

    const regEnd = new Date(matchDate.getTime() - FIVE_HOURS_30_MIN);
    return regEnd
}

 