export function getCsrfToken() {
  const input = document.getElementsByName('csrfmiddlewaretoken')[0] as HTMLInputElement;
  return input.value;
}
