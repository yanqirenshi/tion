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

// ---- 見出しのレベル(Section / H 共通の規則) ----

const heading = require(path.join(DIST, 'components', 'heading.js'));

test('normalizeLev は、数値・文字列・小数・不正な値を規則どおりに丸める', () => {
    const cases = [
        [1, 1], [6, 6], [7, 7], [12, 12],
        ['5', 5], [' 7 ', 7], ['8', 8],
        [2.9, 2], ['3.7', 3],
        [undefined, 4], [null, 4],
        [0, 4], [-1, 4], [0.5, 4], ['0', 4], ['', 4],
        ['abc', 4], ['5px', 4], [NaN, 4], [Infinity, 4], [true, 4], [{}, 4],
    ];
    for (const [input, expected] of cases) {
        assert.equal(heading.normalizeLev(input), expected, `normalizeLev(${JSON.stringify(input)})`);
    }
});

// MUI の sx は fontWeight: 'bold' をテーマの太字(700)に変換する。
const isBold = (el) => { const w = getComputedStyle(el).fontWeight; return w === 'bold' || Number(w) >= 700; };

// [入力, 要素, data-lev, Typography の variant, 太字か]
const LEVELS = [
    [1, 'H1', '1', 'h1', false],
    [3, 'H3', '3', 'h3', false],
    [6, 'H6', '6', 'h6', false],
    [7, 'H6', '7', 'subtitle1', true],
    ['8', 'H6', '8', 'subtitle2', true],
    [12, 'H6', '12', 'subtitle2', true],
    [2.9, 'H2', '2', 'h2', false],
    ['5', 'H5', '5', 'h5', false],
    [0, 'H4', '4', 'h4', false],
    ['abc', 'H4', '4', 'h4', false],
    [undefined, 'H4', '4', 'h4', false],
];

const HEADINGS = [
    ['Section', (lev) => h(tion.Section, {title: 'heading-title', lev}, 'section-body')],
    ['H', (lev) => h(tion.H, {lev}, 'heading-title')],
];

for (const [name, make] of HEADINGS) {
    for (const [lev, tag, dataLev, variant, bold] of LEVELS) {
        test(`${name}: lev=${JSON.stringify(lev)} は ${tag}(data-lev=${dataLev}, ${variant}${bold ? ', 太字' : ''})になり、警告が出ない`, async () => {
            const view = await render(make(lev));
            assert.deepEqual(view.problems, [], '警告・エラーが出ていない');

            const els = view.container.querySelectorAll('[data-lev]');
            assert.equal(els.length, 1, '見出しの要素は 1 つ');

            const el = els[0];
            assert.equal(el.tagName, tag);
            assert.equal(el.getAttribute('data-lev'), dataLev);
            assert.ok(el.classList.contains(`MuiTypography-${variant}`), `variant は ${variant}`);
            assert.ok(el.textContent.includes('heading-title'));
            assert.equal(isBold(el), bold, '太字かどうか');
            await view.unmount();
        });
    }
}

test('Section: lev 7 以上でも落ちない(以前は TypeError だった)', async () => {
    for (const lev of [7, 8, 9, 20, '15']) {
        const view = await render(h(tion.Section, {title: 't', lev}, 'body'));
        assert.deepEqual(view.problems, []);
        assert.ok(view.container.textContent.includes('body'));
        await view.unmount();
    }
});

test('Section: lev 6 > 7 > 8 を入れ子にでき、data-lev を順に読める', async () => {
    const view = await render(
        h(tion.Section, {title: 'a', lev: 6},
          h(tion.Section, {title: 'b', lev: 7},
            h(tion.Section, {title: 'c', lev: '8'}, 'deepest'))));
    assert.deepEqual(view.problems, []);
    assert.deepEqual([...view.container.querySelectorAll('[data-lev]')].map((el) => el.getAttribute('data-lev')), ['6', '7', '8']);
    assert.deepEqual([...view.container.querySelectorAll('[data-lev]')].map((el) => el.tagName), ['H6', 'H6', 'H6']);
    assert.ok(view.container.textContent.includes('deepest'));
    await view.unmount();
});

test('H: sx は 7 以上の太字と合わさり、sx が優先される(オブジェクトでも配列でも)', async () => {
    for (const sx of [{color: 'red'}, [{color: 'red'}], undefined]) {
        const view = await render(h(tion.H, {lev: 8, sx}, 'x'));
        assert.deepEqual(view.problems, []);
        const el = view.container.querySelector('[data-lev]');
        assert.ok(isBold(el), '太字');
        if (sx) assert.equal(getComputedStyle(el).color, 'rgb(255, 0, 0)');
        await view.unmount();
    }

    const view = await render(h(tion.H, {lev: 8, sx: {fontWeight: 'normal'}}, 'x'));
    assert.equal(getComputedStyle(view.container.querySelector('[data-lev]')).fontWeight, 'normal');
    await view.unmount();
});

test('Section: sx の値は外側の Box に効き、インデントの表のキーは sx に混ざらない', async () => {
    const view = await render(h(tion.Section, {title: 't', lev: 3, sx: {backgroundColor: 'red'}}, 'body'));
    assert.deepEqual(view.problems, []);
    const outer = view.container.firstElementChild;
    assert.equal(getComputedStyle(outer).backgroundColor, 'rgb(255, 0, 0)');
    const css = [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
    assert.ok(!/\{[^}]*\b[1-6]\s*:\s*\[object Object\]/.test(css), '"1"〜"6" のキーが CSS に出ていない');
    await view.unmount();
});
