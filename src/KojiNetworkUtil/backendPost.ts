import { RequestError } from "./RequestError";
import { backendUrlGivenPath } from "./backendUrlGivenPath";

export async function backendPost(
  relativePath: string,
  postData: any,
  urlParams?: any
) {
  const response = await fetch(backendUrlGivenPath(relativePath, urlParams), {
    body: JSON.stringify(postData || {}),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    mode: "cors",
  });

  if (response.status == 500) {
    let errorMessage =
      "The server returned a 500 error while processing this request.";
    try {
      const json = await response.json();
      if (json.error != null) {
        errorMessage = json.error;
      }
    } catch (err) {
      // empty
    }

    throw new RequestError(errorMessage);
  }

  if (response.status == 204) {
    return undefined;
  }

  const contentType =
    response.headers.get("content-type") || "application/json";

  if (contentType.indexOf("application/json") !== -1) {
    const json = await response.json();
    return json;
  }

  return undefined;
}
