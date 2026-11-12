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
    ['Figure', () => h(tion.Figure, {src: '/logo192.png', alt: 'figure-alt', caption: 'figure-caption'}), 'figure-caption'],
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

// ---- Figure ----

const SRC = '/logo192.png';

async function renderFigure (props) {
    const view = await render(h(tion.Figure, {src: SRC, ...props}));
    return {
        ...view,
        figure: view.container.querySelector('figure'),
        img: view.container.querySelector('figure > img'),
        caption: view.container.querySelector('figure > figcaption'),
    };
}

test('Figure: figure 要素の中に img があり、src が渡る', async () => {
    const view = await renderFigure({alt: 'a'});
    assert.deepEqual(view.problems, []);
    assert.ok(view.figure, 'figure がある');
    assert.equal(view.figure, view.container.firstElementChild, '外側は figure');
    assert.ok(view.img, 'figure の中に img がある');
    assert.equal(view.img.getAttribute('src'), SRC);
    await view.unmount();
});

test('Figure: caption があれば figcaption が出て、文字と ReactNode が入る', async () => {
    const text = await renderFigure({caption: '図 1: ロゴ'});
    assert.deepEqual(text.problems, []);
    assert.ok(text.caption, 'figcaption がある');
    assert.equal(text.caption.tagName, 'FIGCAPTION');
    assert.equal(text.caption.textContent, '図 1: ロゴ');
    assert.ok(text.img.compareDocumentPosition(text.caption) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING, 'img の下にある');
    await text.unmount();

    const node = await renderFigure({caption: h('span', {id: 'cap-node'}, '強調')});
    assert.deepEqual(node.problems, []);
    assert.equal(node.caption.querySelector('#cap-node').textContent, '強調');
    await node.unmount();
});

test('Figure: caption が無い(省略・null・false・空文字)ときは figcaption を出さない', async () => {
    for (const caption of [undefined, null, false, '']) {
        const view = await renderFigure({alt: 'a', caption});
        assert.deepEqual(view.problems, []);
        assert.equal(view.container.querySelectorAll('figcaption').length, 0, `caption=${JSON.stringify(caption)}`);
        await view.unmount();
    }
});

test('Figure: alt を渡すと alt 属性になり、省略すると alt 属性が付かない(空文字は空の alt)', async () => {
    const withAlt = await renderFigure({alt: '構成図'});
    assert.equal(withAlt.img.getAttribute('alt'), '構成図');
    await withAlt.unmount();

    const without = await renderFigure({caption: 'c'});
    assert.deepEqual(without.problems, []);
    assert.equal(without.img.hasAttribute('alt'), false);
    await without.unmount();

    const empty = await renderFigure({alt: ''});
    assert.equal(empty.img.getAttribute('alt'), '');
    await empty.unmount();
});

test('Figure: width は数値(px)でも文字列でも、その幅になる。maxWidth: 100% は残る', async () => {
    const cases = [[300, '300px'], [1, '1px'], ['50%', '50%'], ['12rem', '12rem']];
    for (const [width, expected] of cases) {
        const view = await renderFigure({alt: 'a', width});
        assert.deepEqual(view.problems, []);
        const style = getComputedStyle(view.img);
        assert.equal(style.width, expected, `width=${JSON.stringify(width)}`);
        assert.equal(style.maxWidth, '100%');
        await view.unmount();
    }
});

test('Figure: 既定の img は元の大きさ(width を指定しない)で、block・maxWidth 100%・height auto', async () => {
    const view = await renderFigure({alt: 'a'});
    const style = getComputedStyle(view.img);
    assert.equal(style.display, 'block');
    assert.equal(style.maxWidth, '100%');
    assert.equal(style.height, 'auto');
    assert.ok(style.width === '' || style.width === 'auto', `width は指定されない: "${style.width}"`);
    await view.unmount();
});

test('Figure: figure の既定の余白は m:0・mt:2・mb:2(左右の余白が 0)', async () => {
    const view = await renderFigure({alt: 'a'});
    const style = getComputedStyle(view.figure);
    assert.equal(style.marginLeft, '0px');
    assert.equal(style.marginRight, '0px');
    assert.equal(style.marginTop, '16px');
    assert.equal(style.marginBottom, '16px');
    await view.unmount();
});

test('Figure: sx は外側の figure に効き、既定の値を上書きできる', async () => {
    const view = await renderFigure({alt: 'a', sx: {backgroundColor: 'red', mt: 5}});
    assert.deepEqual(view.problems, []);
    const style = getComputedStyle(view.figure);
    assert.equal(style.backgroundColor, 'rgb(255, 0, 0)');
    assert.equal(style.marginTop, '40px');
    assert.equal(style.marginBottom, '16px', '上書きしていない値は既定のまま');
    assert.notEqual(getComputedStyle(view.img).backgroundColor, 'rgb(255, 0, 0)', 'img には効かない');
    await view.unmount();
});

test('Figure: figcaption は body2・text.secondary・mt:1', async () => {
    const view = await renderFigure({alt: 'a', caption: 'c'});
    assert.ok(view.caption.classList.contains('MuiTypography-body2'));
    const style = getComputedStyle(view.caption);
    assert.equal(style.marginTop, '8px');
    assert.equal(style.color, 'rgba(0, 0, 0, 0.6)');
    await view.unmount();
});
