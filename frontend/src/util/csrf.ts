export function getCsrfToken() {
  const input = document.getElementsByName('csrfmiddlewaretoken')[0] as HTMLInputElement;
  if (!input) return '';
  return input.value;
}
