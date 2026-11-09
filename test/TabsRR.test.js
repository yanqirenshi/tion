'use strict';

// TabsRR を react-router-dom 6 と 7 の両方で動かし、
// onChange の呼ばれ方と URL(?tab=)の同期を確かめる。
// 検証対象は公開物と同じ dist/ (npm run transpile で生成)。

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
const {JSDOM} = require('jsdom');

// emotion は読み込み時に HTMLElement の有無でキャッシュを作るため、
// MUI を require する前に jsdom をグローバルへ公開しておく。
const dom = new JSDOM('<!doctype html><body></body>', {url: 'http://localhost/'});
for (const name of ['window', 'document', 'HTMLElement', 'Node', 'getComputedStyle']) {
    Object.defineProperty(globalThis, name, {
        value: name === 'window' ? dom.window : name === 'document' ? dom.window.document : dom.window[name],
        configurable: true,
        writable: true,
    });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = require('react');
const {createRoot} = require('react-dom/client');
const {act} = React;

const DIST = path.join(__dirname, '..', 'dist') + path.sep;

// dist/ の `require('react-router-dom')` を、テスト対象の版に差し替える。
let routerPackage = 'react-router-dom-6';
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
    return resolveFilename.call(this, request === 'react-router-dom' ? routerPackage : request, ...rest);
};

function load (pkg) {
    routerPackage = pkg;
    for (const key of Object.keys(require.cache)) {
        if (key.startsWith(DIST)) delete require.cache[key];
    }
    return {rr: require(pkg), tion: require('../dist/router.js')};
}

const LIST = [
    {code: 'a', label: 'Tab A'},
    {code: 'b', label: 'Tab B'},
    {code: 'c', label: 'Tab C'},
];

async function settle () {
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 50)); });
}

async function mount ({rr, tion}, {url, selected = null}) {
    const calls = [];
    const view = {};
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    function App () {
        const [tabs, setTabs] = React.useState({selected, list: LIST});
        const location = rr.useLocation();
        view.navigate = rr.useNavigate();
        view.selected = tabs.selected;
        view.url = location.pathname + location.search;

        return React.createElement(tion.TabsRR, {
            data: tabs,
            onChange: (next) => { calls.push(next.selected); setTabs(next); },
        });
    }

    await act(async () => {
        root.render(
            React.createElement(rr.MemoryRouter, {initialEntries: [url]},
                                React.createElement(App)));
    });
    await settle();

    return {
        calls,
        view,
        click: async (label) => {
            const tab = [...container.querySelectorAll('[role=tab]')].find((t) => t.textContent === label);
            await act(async () => { tab.click(); });
            await settle();
        },
        back: async () => {
            await act(async () => { view.navigate(-1); });
            await settle();
        },
        unmount: async () => {
            await act(async () => root.unmount());
            container.remove();
        },
    };
}

for (const pkg of ['react-router-dom-6', 'react-router-dom-7']) {
    const major = pkg.slice(-1);

    test(`react-router-dom ${major}: TabsRR`, async (t) => {
        const router = load(pkg);

        await t.test('URL の ?tab= で選択が決まり、onChange は 1 回だけ呼ばれる', async () => {
            const app = await mount(router, {url: '/?tab=b'});
            assert.deepEqual(app.calls, ['b']);
            assert.equal(app.view.selected, 'b');
            assert.equal(app.view.url, '/?tab=b');
            await app.unmount();
        });

        await t.test('タブをクリックすると onChange は 1 回だけ呼ばれ、元のタブに戻らず、URL が追従する', async () => {
            const app = await mount(router, {url: '/?tab=b'});
            await app.click('Tab A');
            assert.deepEqual(app.calls, ['b', 'a']);
            assert.equal(app.view.selected, 'a');
            assert.equal(app.view.url, '/?tab=a');
            await app.unmount();
        });

        await t.test('続けてクリックしても、クリックごとに 1 回ずつ呼ばれる', async () => {
            const app = await mount(router, {url: '/?tab=a'});
            await app.click('Tab B');
            await app.click('Tab C');
            assert.deepEqual(app.calls, ['a', 'b', 'c']);
            assert.equal(app.view.selected, 'c');
            assert.equal(app.view.url, '/?tab=c');
            await app.unmount();
        });

        await t.test('?tab= も selected も無ければ、先頭のタブを選ぶ(URL は変えない)', async () => {
            const app = await mount(router, {url: '/'});
            assert.deepEqual(app.calls, ['a']);
            assert.equal(app.view.selected, 'a');
            assert.equal(app.view.url, '/');
            await app.unmount();
        });

        await t.test('?tab= が無く、selected が先頭以外なら、URL を selected に合わせる(onChange は呼ばない)', async () => {
            const app = await mount(router, {url: '/', selected: 'b'});
            assert.deepEqual(app.calls, []);
            assert.equal(app.view.selected, 'b');
            assert.equal(app.view.url, '/?tab=b');
            await app.unmount();
        });

        await t.test('ブラウザの戻るで URL が変わると、選択が追従する', async () => {
            const app = await mount(router, {url: '/?tab=a'});
            await app.click('Tab B');
            await app.back();
            assert.deepEqual(app.calls, ['a', 'b', 'a']);
            assert.equal(app.view.selected, 'a');
            assert.equal(app.view.url, '/?tab=a');
            await app.unmount();
        });
    });
}
