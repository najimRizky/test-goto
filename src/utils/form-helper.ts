export const parseAndSetFormValue = (fieldName: string, value: string, formData: any) => {
  const keys = fieldName.split('.');
  let temp = formData;

  for (let i = 0; i < keys.length - 1; i++) {
    temp = temp[keys[i]];
  }

  temp[keys[keys.length - 1]] = value;

  return { ...formData };
}
