export function filterByMultipleValues(
	stringsArray: string[],
	objectsArray: Array<{ value: string, label: string, }>
) {
	return objectsArray.filter(obj => stringsArray.includes(obj.value));
}

export function filterByValue(array: any[], property: string, value: string) {
    return array.filter(item => item[property] === value);
}
