export function formatAfterEdit(event: any) {
  event.start = event.start.slice(0, 16);
  event.end = event.end.slice(0, 16);
  event.updatedAt = new Date(Date.parse(event.updatedAt)).toLocaleString("en-US", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone});
  return event;
}

export const fixDatesAsIso = (event: any) => {
  const starter = new Date(Date.parse(event.start));
  starter.setMinutes(starter.getMinutes() - starter.getTimezoneOffset());
  const ender = new Date(Date.parse(event.end));
  ender.setMinutes(ender.getMinutes() - ender.getTimezoneOffset());

  return {
    start: starter.toISOString().slice(0, 16),
    end: ender.toISOString().slice(0, 16)
  };
};

export const formatDateForTimezone = (date: string, parse?: boolean) => {
  const formattedDate = new Date(parse ? Date.parse(date) : date)
    .toLocaleString(
      "en-US",
      {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    );
  return formattedDate;
};

export const sortNumberedArray = (rows: any[]) => {
  rows.sort(function(a, b) {
    return a - b;
  });
  return rows;
}

export function truncate(str: String, n: number) {
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};

export function truncateFromCenter(fullStr: string, strLen: number, separator: string) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || '...';

  var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow/2),
      backChars = Math.floor(charsToShow/2);

  return fullStr.substr(0, frontChars) +
         separator +
         fullStr.substr(fullStr.length - backChars);
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeSources(text: string): string {
  return text.replace(/(sources:)[\s\S]*/i, '').trim();
}

export function wrapSourcesInAnchorTags(sources: string[]): string[] {
  return sources.map(
      source => `<a href="${source.replace('rtdocs', 'https:/')}" target="_blank" class="source-link"><div class="well">${source.replace('rtdocs', 'https:/')}</div></a>`
  );
}

export function extractSources(text: string): string[] | null {
  const lowerCaseText = text.toLowerCase();
  const sourcesKeyword = "sources:";
  const sourcesIndex = lowerCaseText.indexOf(sourcesKeyword);

  if (sourcesIndex === -1) {
    return null;
  }

  const sourcesText = text.substring(sourcesIndex + sourcesKeyword.length);
  const sources = sourcesText.split(/,|\n-/).map(source => source.trim());

  return sources;
}

export type Jwt = {
    _id?: string;
    email?: string;
    iat: number;
    exp: number;
    recipient?: {
        email: string;
    }
    invoice?: {
        success: boolean;
        _id: string;
    }
}

export function generateRandomString(length: number): string {
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result: string = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function removeElementsAfterIndex(arr: any[], index: number) {
  if (index < arr.length - 1) {
    arr.splice(index + 1);
  }
  return arr;
}

export function removeElementsFromIndex(arr: any[], index: number) {
  if (index < arr.length) {
    arr.splice(index);
  }
  return arr;
}

export function extractValues(input: unknown): string[] {
  return (input as Array<{ value: string }>).map(item => item.value);
}

export function removeObjectById(list: any[], _id: string): any[] {
  const filteredList = list.filter((item) => item._id !== _id);
  return filteredList;
}

export function appendQueryParamToUrl(url: string, key: string, value: string): string {
    const separator: string = (url.indexOf('?') !== -1) ? '&' : '?';
    return url + separator + key + '=' + encodeURIComponent(value);
}