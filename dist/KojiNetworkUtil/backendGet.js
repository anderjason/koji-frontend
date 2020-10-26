"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backendGet = void 0;
const backendUrlGivenPath_1 = require("./backendUrlGivenPath");
const RequestError_1 = require("./RequestError");
async function backendGet(relativeUrl, params) {
    const url = backendUrlGivenPath_1.backendUrlGivenPath(relativeUrl, params);
    const response = await fetch(url, {
        credentials: "include",
    });
    if (response.status == 404) {
        throw new RequestError_1.RequestError("The requested resource could not be found.");
    }
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
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => {
            reject(new DOMException("Error parsing file in apiGet"));
        };
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
}
exports.backendGet = backendGet;
//# sourceMappingURL=backendGet.js.map