export const getEmail = (users, loggedInUSer) =>
  users?.filter((userEmail) => userEmail !== loggedInUSer?.email)?.[0];
