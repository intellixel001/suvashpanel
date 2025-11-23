export default function handleError(error) {
  if (!error.response) {
    console.error("Network error:", error.message);
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      console.warn("Bad request:", data?.message || data);
      break;
    case 403:
      console.warn("Forbidden:", data?.message);
      break;
    case 404:
      console.warn("Not found:", data?.message);
      break;
    case 500:
      console.error("Server error:", data?.message);
      break;
    default:
      console.error(`Unhandled error [${status}]:`, data?.message);
  }
}
