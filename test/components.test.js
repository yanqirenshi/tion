'use strict';

// tion の全コンポーネントを jsdom で描画するスモークテスト。
// インストールされている MUI / React の組み合わせで動くことを確かめる。
//   既定: ../dist を、ルートの devDependencies の組み合わせで検証する。
//   別の組み合わせ(一時アプリに npm pack した tion を入れた場合など)では、
//   TION_DIST=<tion の dist のパス> TION_ROUTER_PKG=react-router-dom を指定する。

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
const {JSDOM} = require('jsdom');

// react-measure(FrameTabs)が requestAnimationFrame を使うため pretendToBeVisual が要る。
const dom = new JSDOM('<!doctype html><body></body>', {url: 'http://localhost/', pretendToBeVisual: true});
for (const name of ['window', 'document', 'HTMLElement', 'Node', 'getComputedStyle']) {
    Object.defineProperty(globalThis, name, {
        value: name === 'window' ? dom.window : name === 'document' ? dom.window.document : dom.window[name],
        configurable: true,
        writable: true,
    });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const ROUTER = process.env.TION_ROUTER_PKG || 'react-router-dom-7';
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
    return resolveFilename.call(this, request === 'react-router-dom' ? ROUTER : request, ...rest);
};

const React = require('react');
const {createRoot} = require('react-dom/client');
const {act} = React;
const rr = require(ROUTER);

const DIST = process.env.TION_DIST || path.join(__dirname, '..', 'dist');
const tion = require(path.join(DIST, 'index.js'));
const tionRouter = require(path.join(DIST, 'router.js'));

const h = React.createElement;

// React / MUI が出す警告(未知の props、非推奨など)は、失敗として扱う。
async function render (element) {
    const problems = [];
    const original = {error: console.error, warn: console.warn};
    console.error = (...args) => problems.push(args.map(String).join(' '));
    console.warn = (...args) => problems.push(args.map(String).join(' '));

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    try {
        await act(async () => { root.render(element); });
        await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
    } finally {
        console.error = original.error;
        console.warn = original.warn;
    }

    return {
        container,
        problems: problems.filter((p) => !p.includes('React Router Future Flag Warning')),
        unmount: async () => { await act(async () => root.unmount()); container.remove(); },
    };
}

const LIST = [{code: 'a', label: 'Tab A'}, {code: 'b', label: 'Tab B'}];

const CASES = [
    ['Wall', () => h(tion.Wall, null, 'wall-text'), 'wall-text'],
    ['Frame', () => h(tion.Frame, null, 'frame-text'), 'frame-text'],
    ['Panel', () => h(tion.Panel, {sx: {p: 3}}, 'panel-text'), 'panel-text'],
    ['Section', () => h(tion.Section, {title: 'section-title', num: '1.', lev: 3}, 'section-body'), 'section-body'],
    ['H', () => h(tion.H, {lev: 2}, 'h-text'), 'h-text'],
    ['P', () => h(tion.P, null, 'p-text'), 'p-text'],
    ['S', () => h(tion.S, null, 's-text'), 's-text'],
    ['Plane', () => h(tion.Plane, null, 'plane-text'), 'plane-text'],
    ['LinkOutSite', () => h(tion.LinkOutSite, {href: 'https://example.com/'}, 'out-link'), 'out-link'],
    ['GithubCorners', () => h(tion.GithubCorners), ''],
    ['Tabs', () => h(tion.Tabs, {data: {selected: 'a', list: LIST}, onChange: () => {}}), 'Tab A'],
    ['FrameTabs', () => h(tion.FrameTabs, {tabs: {selected: 'a', list: LIST}, onChangeTabs: () => {}}, 'frametabs-body'), 'frametabs-body'],
    ['Table', () => h(tion.Table, {
        columns: [{code: 'a', label: 'ColA', key: 'a'}, {code: 'b', label: 'ColB', val: (row) => row.b * 2}],
        rows: [{a: 'cell-a', b: 21}],
        ids: {column: (c) => c.code, row: (r, i) => i},
    }), 'cell-a'],
    ['LinkReactRouter (tion/router)', () => h(rr.MemoryRouter, null, h(tionRouter.LinkReactRouter, {href: '/about'}, 'rr-link')), 'rr-link'],
    ['TabsRR (tion/router)', () => h(rr.MemoryRouter, {initialEntries: ['/?tab=b']},
                                     h(tionRouter.TabsRR, {data: {selected: 'b', list: LIST}, onChange: () => {}})), 'Tab B'],
];

for (const [name, element, text] of CASES) {
    test(`${name} を描画できる`, async () => {
        const view = await render(element());
        assert.deepEqual(view.problems, [], '警告・エラーが出ていない');
        assert.ok(view.container.textContent.includes(text), `「${text}」が表示される`);
        await view.unmount();
    });
}

test('H は lev に応じた見出し要素になる', async () => {
    const view = await render(h(tion.H, {lev: 2}, 'x'));
    assert.ok(view.container.querySelector('h2'));
    await view.unmount();
});

test('Tabs は MUI のタブとして描画され、選択状態を持つ', async () => {
    const view = await render(h(tion.Tabs, {data: {selected: 'b', list: LIST}, onChange: () => {}}));
    const tabs = [...view.container.querySelectorAll('[role=tab]')];
    assert.deepEqual(tabs.map((t) => t.textContent), ['Tab A', 'Tab B']);
    assert.deepEqual(tabs.map((t) => t.getAttribute('aria-selected')), ['false', 'true']);
    await view.unmount();
});

test('Table は列と行を描画する', async () => {
    const view = await render(h(tion.Table, {
        columns: [{code: 'a', label: 'ColA', key: 'a'}, {code: 'b', label: 'ColB', val: (row) => row.b * 2}],
        rows: [{a: 1, b: 21}, {a: 2, b: 4}],
        ids: {},
    }));
    assert.equal(view.container.querySelectorAll('thead th').length, 2);
    assert.equal(view.container.querySelectorAll('tbody tr').length, 2);
    assert.ok(view.container.textContent.includes('42'));
    await view.unmount();
});

test('MUI のコンポーネントは 1 つの MUI から読み込まれている', () => {
    const files = Object.keys(require.cache).filter((k) => /[\\/]@mui[\\/]material[\\/]/.test(k));
    const roots = new Set(files.map((k) => k.replace(/([\\/]node_modules[\\/]@mui[\\/]material)[\\/].*$/, '$1')));
    assert.equal(roots.size, 1, `@mui/material の実体が 1 つだけ: ${[...roots].join(', ')}`);
});
