import AuthStore from "./authStore";
import FeedbackStore from "./feedbackStore";
import UserStore from "./userStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  feedbackStore: FeedbackStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.feedbackStore = new FeedbackStore(this);
  }
}

const rootStore = new RootStore();
export default rootStore;
