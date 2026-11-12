'use strict';

// Panel の kind(情報・メモ・注意・成功・エラー)と icon を jsdom で確かめる。
// jsdom の準備と、警告を失敗として扱う描画の仕方は test/components.test.js と同じ。
//   既定: ../dist を検証する。TION_DIST=<tion の dist のパス> で別の場所も検証できる。

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {JSDOM} = require('jsdom');

const dom = new JSDOM('<!doctype html><body></body>', {url: 'http://localhost/', pretendToBeVisual: true});
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

const DIST = process.env.TION_DIST || path.join(__dirname, '..', 'dist');
const tion = require(path.join(DIST, 'index.js'));

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
        panel: container.firstElementChild,
        problems,
        unmount: async () => { await act(async () => root.unmount()); container.remove(); },
    };
}

// 描画して、中身(innerHTML)と警告を返して片付ける。
async function htmlOf (element) {
    const view = await render(element);
    const result = {html: view.container.innerHTML, problems: view.problems};
    await view.unmount();
    return result;
}

const rgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};

// 仕様の色(background / border / icon)
const KINDS = {
    info:    {background: '#e9f2ff', border: '#cce0ff', icon: '#1d7afc'},
    note:    {background: '#f3f0ff', border: '#dfd8fd', icon: '#8f7ee7'},
    warning: {background: '#fff7d6', border: '#f8e6a0', icon: '#b38600'},
    success: {background: '#dcfff1', border: '#baf3db', icon: '#22a06b'},
    error:   {background: '#ffeceb', border: '#ffd5d2', icon: '#e2483d'},
};

// ---- kind なし(今までと同じ) ----

test('kind なし: svg が無く、子要素の構成が今までと同じ(Box が 1 つで、中身は子だけ)', async () => {
    const view = await render(h(tion.Panel, null, 'panel-text'));
    assert.deepEqual(view.problems, []);

    assert.equal(view.container.children.length, 1);
    assert.equal(view.panel.tagName, 'DIV');
    assert.equal(view.panel.children.length, 0, '余分な要素が無い');
    assert.equal(view.panel.childNodes.length, 1);
    assert.equal(view.panel.textContent, 'panel-text');
    assert.equal(view.container.querySelectorAll('svg').length, 0);

    const style = getComputedStyle(view.panel);
    assert.notEqual(style.display, 'flex', 'flex は付かない');
    assert.equal(style.border, '1px solid rgba(0, 0, 0, 0.12)');
    assert.equal(style.padding, '16px');
    await view.unmount();
});

test('kind なし: 子が要素でも、そのまま直下に置かれる', async () => {
    const view = await render(h(tion.Panel, null, h('p', {id: 'a'}, 'A'), h('p', {id: 'b'}, 'B')));
    assert.deepEqual([...view.panel.children].map((el) => el.id), ['a', 'b']);
    await view.unmount();
});

test('kind なし: icon を渡しても何も出ない(kind があるときだけ効く)', async () => {
    const plain = await htmlOf(h(tion.Panel, null, 'x'));
    for (const icon of [true, false, null, h('span', {id: 'custom'}, '!')]) {
        const result = await htmlOf(h(tion.Panel, {icon}, 'x'));
        assert.deepEqual(result.problems, []);
        assert.equal(result.html, plain.html);
    }
});

test('kind なし: sx は今までどおり効く', async () => {
    const view = await render(h(tion.Panel, {sx: {backgroundColor: 'red', p: 3}}, 'x'));
    assert.deepEqual(view.problems, []);
    const style = getComputedStyle(view.panel);
    assert.equal(style.backgroundColor, 'rgb(255, 0, 0)');
    assert.equal(style.padding, '24px');
    await view.unmount();
});

// ---- 5 つの kind ----

for (const [kind, color] of Object.entries(KINDS)) {
    test(`kind="${kind}": 背景・枠の色・svg のアイコンが出て、警告が出ない`, async () => {
        const view = await render(h(tion.Panel, {kind}, 'panel-text'));
        assert.deepEqual(view.problems, [], '警告・エラーが出ていない');

        const style = getComputedStyle(view.panel);
        assert.equal(style.backgroundColor, rgb(color.background), '背景の色');
        assert.equal(style.borderColor, rgb(color.border), '枠の色');
        assert.equal(style.borderStyle, 'solid');
        assert.equal(style.padding, '16px', '余白は今までどおり');

        const svgs = view.container.querySelectorAll('svg');
        assert.equal(svgs.length, 1, 'アイコンは 1 つ');
        const svg = svgs[0];
        assert.equal(svg.getAttribute('aria-hidden'), 'true');
        assert.ok(svg.querySelector('circle, path, line'), '図形で描かれている');
        assert.equal(getComputedStyle(svg).color, rgb(color.icon), 'アイコンの色');
        assert.equal(getComputedStyle(svg).fontSize, '20px', 'アイコンの大きさ');

        assert.ok(view.container.textContent.includes('panel-text'));
        await view.unmount();
    });
}

test('5 つの kind のアイコンは、すべて違う絵になる', async () => {
    const drawings = [];
    for (const kind of Object.keys(KINDS)) {
        const view = await render(h(tion.Panel, {kind}, 'x'));
        drawings.push(view.container.querySelector('svg').innerHTML);
        await view.unmount();
    }
    assert.equal(new Set(drawings).size, 5);
});

test('アイコンの形: info と success と error は丸、warning は三角、note は紙', async () => {
    const shapes = {};
    for (const kind of Object.keys(KINDS)) {
        const view = await render(h(tion.Panel, {kind}, 'x'));
        const svg = view.container.querySelector('svg');
        shapes[kind] = {
            circles: svg.querySelectorAll('circle').length,
            paths: [...svg.querySelectorAll('path')].map((p) => p.getAttribute('d')),
            lines: svg.querySelectorAll('line').length,
        };
        await view.unmount();
    }
    for (const kind of ['info', 'success', 'error']) assert.equal(shapes[kind].circles, 1, `${kind} は丸`);
    assert.equal(shapes.warning.circles, 0);
    assert.equal(shapes.note.circles, 0);

    assert.equal(shapes.info.lines, 2, 'i の縦棒と点');
    assert.equal(shapes.error.lines, 2, '× の 2 本');
    assert.equal(shapes.success.paths.length, 1, 'チェック');
    assert.equal(shapes.warning.paths.length, 1, '三角');
    assert.equal(shapes.warning.lines, 2, '! の縦棒と点');
    assert.equal(shapes.note.paths.length, 2, '紙の輪郭と折り目');
    assert.equal(shapes.note.lines, 2, 'メモの行');
});

// ---- 配置 ----

test('kind あり: アイコンが左上、本文がその右。flex・gap・alignItems が指定どおり', async () => {
    const view = await render(h(tion.Panel, {kind: 'info'}, h('p', {id: 'body'}, '本文')));
    const style = getComputedStyle(view.panel);
    assert.equal(style.display, 'flex');
    assert.equal(style.alignItems, 'flex-start');
    assert.equal(style.gap, '12px', 'gap: 1.5(spacing 8px の 1.5 倍)');

    assert.equal(view.panel.children.length, 2, 'アイコンの枠と本文の枠');
    const [iconBox, body] = view.panel.children;
    assert.ok(iconBox.querySelector('svg'), '1 つ目(左)がアイコン');
    assert.ok(body.querySelector('#body'), '2 つ目(右)が本文');
    assert.equal(body.querySelector('svg'), null);

    const bodyStyle = getComputedStyle(body);
    assert.equal(bodyStyle.minWidth, '0px', '長い文や表がはみ出さない');
    assert.equal(bodyStyle.flexGrow, '1');
    await view.unmount();
});

test('kind あり: アイコンの枠は縮まず、高さが本文の 1 行分(1.5em)で、中で縦中央に置く', async () => {
    const view = await render(h(tion.Panel, {kind: 'warning'}, 'x'));
    const iconBox = getComputedStyle(view.panel.children[0]);
    assert.equal(iconBox.display, 'flex');
    assert.equal(iconBox.alignItems, 'center');
    assert.equal(iconBox.height, '1.5em');
    assert.equal(iconBox.flexShrink, '0');
    await view.unmount();
});

test('kind あり: 本文に表のような広い要素を入れても落ちず、警告も出ない', async () => {
    const view = await render(h(tion.Panel, {kind: 'note'},
        h(tion.Table, {
            columns: [{code: 'a', label: 'ColA', key: 'a'}],
            rows: [{a: 'cell-a'}],
            ids: {column: (c) => c.code, row: (r, i) => i},
        })));
    assert.deepEqual(view.problems, []);
    assert.ok(view.panel.children[1].querySelector('table'));
    assert.ok(view.container.textContent.includes('cell-a'));
    await view.unmount();
});

// ---- icon ----

test('icon={false}: svg が出ず、色だけ変わる(flex も枠も付かない)', async () => {
    const view = await render(h(tion.Panel, {kind: 'error', icon: false}, 'panel-text'));
    assert.deepEqual(view.problems, []);
    assert.equal(view.container.querySelectorAll('svg').length, 0);

    const style = getComputedStyle(view.panel);
    assert.equal(style.backgroundColor, rgb(KINDS.error.background));
    assert.equal(style.borderColor, rgb(KINDS.error.border));
    assert.notEqual(style.display, 'flex');
    assert.equal(view.panel.children.length, 0);
    assert.equal(view.panel.textContent, 'panel-text');
    await view.unmount();
});

test('icon={false} を 5 つの kind すべてで確かめる', async () => {
    for (const [kind, color] of Object.entries(KINDS)) {
        const view = await render(h(tion.Panel, {kind, icon: false}, 'x'));
        assert.deepEqual(view.problems, []);
        assert.equal(view.container.querySelectorAll('svg').length, 0, `${kind}: svg が無い`);
        assert.equal(getComputedStyle(view.panel).backgroundColor, rgb(color.background), `${kind}: 背景`);
        await view.unmount();
    }
});

test('icon={null} も、アイコンを出さない', async () => {
    const view = await render(h(tion.Panel, {kind: 'info', icon: null}, 'x'));
    assert.deepEqual(view.problems, []);
    assert.equal(view.container.querySelectorAll('svg').length, 0);
    assert.equal(view.panel.children.length, 0);
    await view.unmount();
});

test('icon に要素を渡すと、既定のアイコンの代わりにそれが左に出る', async () => {
    const view = await render(h(tion.Panel, {kind: 'success', icon: h('span', {id: 'custom-icon'}, '★')}, h('p', {id: 'body'}, '本文')));
    assert.deepEqual(view.problems, []);
    assert.equal(view.container.querySelectorAll('svg').length, 0, '既定の svg は出ない');

    const custom = view.container.querySelector('#custom-icon');
    assert.ok(custom);
    assert.equal(custom.textContent, '★');
    assert.equal(view.panel.children[0].firstElementChild, custom, '左の枠に入る');
    assert.ok(view.panel.children[1].querySelector('#body'), '本文は右');
    assert.equal(getComputedStyle(view.panel).backgroundColor, rgb(KINDS.success.background), '色は kind のまま');
    await view.unmount();
});

test('icon に svg の要素を渡しても、そのまま出る', async () => {
    const custom = h('svg', {id: 'my-svg', viewBox: '0 0 10 10'}, h('circle', {cx: 5, cy: 5, r: 4}));
    const view = await render(h(tion.Panel, {kind: 'info', icon: custom}, 'x'));
    assert.deepEqual(view.problems, []);
    const svgs = view.container.querySelectorAll('svg');
    assert.equal(svgs.length, 1);
    assert.equal(svgs[0].id, 'my-svg');
    await view.unmount();
});

test('icon={true} と icon 省略は、同じ既定のアイコン', async () => {
    const omitted = await htmlOf(h(tion.Panel, {kind: 'note'}, 'x'));
    const explicit = await htmlOf(h(tion.Panel, {kind: 'note', icon: true}, 'x'));
    assert.deepEqual(explicit.problems, []);
    assert.equal(explicit.html, omitted.html);
    assert.ok(omitted.html.includes('<svg'));
});

// ---- 知らない kind ----

test('知らない kind は、kind なしと同じ DOM になり、警告が出ない', async () => {
    const plain = await htmlOf(h(tion.Panel, null, 'x'));
    const unknown = ['foo', 'INFO', ' info', '', 'constructor', 'toString', '__proto__', 'hasOwnProperty', 0, 1, true, false, null, {}, ['info'], () => 'info'];
    for (const kind of unknown) {
        const result = await htmlOf(h(tion.Panel, {kind}, 'x'));
        assert.deepEqual(result.problems, [], `kind=${String(kind)}: 警告が出ない`);
        assert.equal(result.html, plain.html, `kind=${String(kind)}: kind なしと同じ`);
    }
});

test('知らない kind では icon も効かない(svg が出ない)', async () => {
    const view = await render(h(tion.Panel, {kind: 'foo', icon: h('span', {id: 'custom'}, '!')}, 'x'));
    assert.deepEqual(view.problems, []);
    assert.equal(view.container.querySelectorAll('svg').length, 0);
    assert.equal(view.container.querySelector('#custom'), null);
    assert.notEqual(getComputedStyle(view.panel).display, 'flex');
    await view.unmount();
});

test('知らない kind でも、sx は今までどおり効く', async () => {
    const view = await render(h(tion.Panel, {kind: 'foo', sx: {backgroundColor: 'red'}}, 'x'));
    assert.equal(getComputedStyle(view.panel).backgroundColor, 'rgb(255, 0, 0)');
    await view.unmount();
});

// ---- sx ----

test('sx は kind の色より優先される(背景・枠の色)', async () => {
    const view = await render(h(tion.Panel, {kind: 'info', sx: {backgroundColor: 'red', borderColor: 'blue'}}, 'x'));
    assert.deepEqual(view.problems, []);
    const style = getComputedStyle(view.panel);
    assert.equal(style.backgroundColor, 'rgb(255, 0, 0)');
    assert.equal(style.borderColor, 'rgb(0, 0, 255)');
    assert.equal(view.container.querySelectorAll('svg').length, 1, 'アイコンはそのまま');
    await view.unmount();
});

test('sx は kind の色以外にも重なる(余白・flex の gap・並べ方)', async () => {
    const view = await render(h(tion.Panel, {kind: 'warning', sx: {p: 4, gap: 3, alignItems: 'center', mt: 2}}, 'x'));
    assert.deepEqual(view.problems, []);
    const style = getComputedStyle(view.panel);
    assert.equal(style.padding, '32px');
    assert.equal(style.gap, '24px');
    assert.equal(style.alignItems, 'center');
    assert.equal(style.marginTop, '16px');
    assert.equal(style.backgroundColor, rgb(KINDS.warning.background), '指定しなかった色は kind のまま');
    await view.unmount();
});

test('sx で kind の色の一方だけを変えても、もう一方は kind の色のまま', async () => {
    const view = await render(h(tion.Panel, {kind: 'error', sx: {backgroundColor: 'white'}}, 'x'));
    const style = getComputedStyle(view.panel);
    assert.equal(style.backgroundColor, 'rgb(255, 255, 255)');
    assert.equal(style.borderColor, rgb(KINDS.error.border));
    await view.unmount();
});

test('icon={false} でも sx は kind の色より優先される', async () => {
    const view = await render(h(tion.Panel, {kind: 'success', icon: false, sx: {backgroundColor: 'red'}}, 'x'));
    assert.equal(getComputedStyle(view.panel).backgroundColor, 'rgb(255, 0, 0)');
    await view.unmount();
});

// ---- 警告 ----

test('kind・icon・sx のどの組み合わせでも警告が出ない', async () => {
    const kinds = [undefined, 'info', 'note', 'warning', 'success', 'error', 'foo'];
    const icons = [undefined, false, null, true, h('b', null, '*')];
    const sxs = [undefined, {}, {backgroundColor: 'red'}];
    for (const kind of kinds) {
        for (const icon of icons) {
            for (const sx of sxs) {
                const result = await htmlOf(h(tion.Panel, {kind, icon, sx}, 'x'));
                assert.deepEqual(result.problems, [], `kind=${String(kind)} icon=${String(icon)}`);
            }
        }
    }
});
