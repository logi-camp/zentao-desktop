export function fuzzy_time(dif: number) {
  let res = '';

  const t_second = 1;
  const t_minute = t_second * 60;
  const t_hour = t_minute * 60;
  const t_day = t_hour * 24;
  const t_month = Math.floor(t_day * 30.4);
  const t_year = t_month * 12;

  const fuzzy_string = (time_ref: number, time_str: string, max?: number) => {
    const fuzzy = max ? Math.floor(dif / time_ref) % max : Math.floor(dif / time_ref);
    if (fuzzy === 0) {
      return '';
    }
    if (res) {
      res += ' ';
    }
    res += fuzzy + ' ' + time_str;
    if (fuzzy != 1) {
      res += 's';
    }
  };

  if (dif >= t_year) fuzzy_string(t_year, 'year');
  if (dif >= t_month) fuzzy_string(t_month, 'month', 12);
  if (dif >= t_day) fuzzy_string(t_day, 'day', 30);
  if (dif >= t_hour) fuzzy_string(t_hour, 'hour', 24);
  if (dif >= t_minute) fuzzy_string(t_minute, 'minute', 60);
  //if (dif >= t_second) fuzzy_string(t_second, 'second', 60);
  else res = 'zero';

  return res;
}
