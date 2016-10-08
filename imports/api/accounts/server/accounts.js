import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const userCopy = Object.assign({}, user);
  userCopy.profile = options.profile || {};

  if (user.services.google) {
    userCopy.emails = [{ address: user.services.google.email, verified: true }];
    userCopy.profile.picture = user.services.google.picture;
  }
  return userCopy;
});
