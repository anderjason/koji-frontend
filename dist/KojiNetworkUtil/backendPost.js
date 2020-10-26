"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backendPost = void 0;
const RequestError_1 = require("./RequestError");
const backendUrlGivenPath_1 = require("./backendUrlGivenPath");
async function backendPost(relativePath, postData, urlParams) {
    const url = backendUrlGivenPath_1.backendUrlGivenPath(relativePath, urlParams);
    const response = await fetch(url, {
        body: JSON.stringify(postData || {}),
        credentials: "include",
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        mode: "cors",
    });
    if (response.status == 500) {
        let errorMessage = "The server returned a 500 error while processing this request.";
        try {
            const json = await response.json();
            if (json.error != null) {
                errorMessage = json.error;
            }
        }
        catch (err) {
            // empty
        }
        throw new RequestError_1.RequestError(errorMessage);
    }
    if (response.status == 204) {
        return undefined;
    }
    const contentType = response.headers.get("content-type") || "application/json";
    if (contentType.indexOf("application/json") !== -1) {
        const json = await response.json();
        return json;
    }
    return undefined;
}
exports.backendPost = backendPost;
//# sourceMappingURL=backendPost.js.map