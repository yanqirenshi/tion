export {default as Wall} from './components/Wall.js';

export {default as Frame} from './components/Frame.js';
export {default as FrameTabs} from './components/FrameTabs.js';
export {default as Panel} from './components/Panel.js';

export {default as GithubCorners} from './components/GithubCorners.js';

// LinkReactRouter/LinkRR は react-router-dom(optional peer)に依存するため、
// メインの barrel には含めず `tion/router` サブパスから提供する
// (react-router-dom 未導入の利用者が Section 等を import しただけで
// Cannot find module にならないようにするため)。

export {default as LinkOutSite} from './components/LinkOutSite.js';
export {default as LinkOS} from './components/LinkOutSite.js';

export {default as Tabs} from './components/Tabs.js';
// TabsRR も react-router-dom に依存するため `tion/router` サブパスへ

export {default as Table} from './components/Table.js';

export {default as Section} from './components/Section.js';
export {default as H} from './components/H.js';
export {default as P} from './components/P.js';
export {default as S} from './components/S.js';
