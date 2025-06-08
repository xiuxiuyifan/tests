import { types } from 'mobx-state-tree';

const Author = types.model({
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
});

const Tweet = types.model({
  id: types.identifier,
  author: types.reference(Author), // 仅存储 id 引用
  body: types.string,
  timestamp: types.number,
});

const RootStore = types.model({
  authors: types.array(Author),
  tweets: types.array(Tweet),
});

// 实例化几个模型实例
const jamon = Author.create({
  id: 'jamon',
  firstName: 'Jamon',
  lastName: 'Holmgren',
});

const tewwt = Tweet.create({
  id: '1',
  author: jamon.id,
  body: 'Hello World!',
  timestamp: Date.now(),
});

export const rootStore = RootStore.create({
  authors: [jamon],
  tweets: [tewwt],
});
