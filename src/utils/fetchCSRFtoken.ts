async function getCSRFToken() {
  // Read the CSRF token from the cookie
  const match = document.cookie.match(new RegExp('(^| )csrf_token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default getCSRFToken;