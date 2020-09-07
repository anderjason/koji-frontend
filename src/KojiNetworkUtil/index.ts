import { backendGet } from "./backendGet";
import { backendPost } from "./backendPost";
import { backendUrlGivenPath } from "./backendUrlGivenPath";

export class KojiNetworkUtil {
  static backendGet = backendGet;
  static backendPost = backendPost;
  static backendUrlGivenPath = backendUrlGivenPath;
}
