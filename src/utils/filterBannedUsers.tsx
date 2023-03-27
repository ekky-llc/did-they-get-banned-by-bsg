export async function filterBannedUsers(name: string, date: string, type: string) {

  let query = '/api/banned_users';
  if (name) {
    if (query.includes('?')) {
      query += `&name=${name}`;
    }

    else {
      query += `?name=${name}`;
    }
  }

  if (date) {
    if (query.includes('?')) {
      query += `&date=${date}`;
    }

    else {
      query += `?date=${date}`;
    }
  }

  if (type) {
    if (query.includes('?')) {
      query += `&type=${date}`;
    }

    else {
      query += `?type=${date}`;
    }
  }

  const result = await fetch(query).then(async (res) => await res.json());

  return result;
}
export const DEBOUNCE_DELAY = 500; // milliseconds

export function debounce(func: Function, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
    }, delay);
  };
}
