import { CollectionTypes, Comic, fetchUser, fetchWishList } from '@m-nny/comicgeeks';
import { Confirm, Input } from 'enquirer';

const usernamePrompt = new Input({
  message: 'What is you username',
  default: 'm_nny',
});

const confirmPromt = new Confirm({
  message: 'Download this issues?',
});

export async function getIssues(): Promise<Comic[] | null> {
  //const username = await usernamePrompt.run();
  const username = 'm_nny';
  const user = await fetchUser(username.valueOf());
  console.log(`Got user ${user.name} with id ${user.id}`);

  //const wishlistSeries = await fetchWishList(user.id, CollectionTypes.Series);
  //console.log(`Got ${wishlistSeries.length} series in wishlist`);

  const issues = await fetchWishList(user.id, CollectionTypes.Issue);
  console.log(`Got ${issues.length} issues in wishlist`);

  //console.log(wishlistSeries[0], issues[0]);

  //const ok = await confirmPromt.run();
  //if (!ok) {
  //return null;
  //}
  return issues;
}
