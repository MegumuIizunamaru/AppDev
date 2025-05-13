export interface CurrentUserType {
  _id: string;
  email: string;
  username: string;
  createdAt: Date;
}
let currentUser: CurrentUserType | null = null;

export const getCurrentUser = () => currentUser;

export const setCurrentUser = (user: CurrentUserType | null) => {
  currentUser = user;
};
