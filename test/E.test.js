'use strict';

// E(文中の強調)のテスト。
// jsdom の準備と、警告を失敗として扱う描画の仕方は components.test.js と同じ。
//   別の組み合わせ(一時アプリに npm pack した tion を入れた場合など)では、
//   TION_DIST=<tion の dist のパス> を指定する。

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
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

const React = require('react');
const {createRoot} = require('react-dom/client');
const {act} = React;
const {ThemeProvider, createTheme} = require('@mui/material/styles');

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
        problems,
        unmount: async () => { await act(async () => root.unmount()); container.remove(); },
    };
}

async function renderEm (props, children = '強調', wrap = (el) => el) {
    const view = await render(wrap(h(tion.E, props, children)));
    return {...view, em: view.container.querySelector('strong, span')};
}

const isBold = (el) => { const w = getComputedStyle(el).fontWeight; return w === 'bold' || Number(w) >= 700; };

// '#rrggbb' → 'rgb(r, g, b)'(jsdom の getComputedStyle の表記)
function toRgb (hex) {
    const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    assert.ok(m, `#rrggbb の形ではない: ${hex}`);
    return `rgb(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)})`;
}

// 要素の class に当たるルールの宣言(emotion は CSSOM に insertRule するので、style タグの文字列には出ない)。
// getComputedStyle では「指定していない」と「既定値」を区別できないため、指定の有無の確認に使う。
function declarations (el) {
    const found = [];
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
            if (rule.selectorText && [...el.classList].some((cls) => rule.selectorText.includes('.' + cls)))
                found.push(rule.style.cssText);
        }
    }
    return found.join(' ');
}

const DEFAULT_THEME = createTheme();
const CUSTOM_THEME = createTheme({palette: {primary: {main: '#123456'}, error: {main: '#654321'}}});
const withTheme = (theme) => (el) => h(ThemeProvider, {theme}, el);

test('E は tion のメインの barrel から export されている', () => {
    assert.equal(typeof tion.E, 'function');
});

test('E: 既定は strong 要素の太字で、下線も色も付かない', async () => {
    const view = await renderEm({});
    assert.deepEqual(view.problems, [], '警告・エラーが出ていない');
    assert.equal(view.em.tagName, 'STRONG');
    assert.equal(view.em.textContent, '強調');
    assert.ok(isBold(view.em), '太字');
    assert.ok(!/underline/.test(getComputedStyle(view.em).textDecoration), '下線なし');
    assert.ok(!/(^|[\s;])color:/.test(declarations(view.em)), '色は変えない');
    await view.unmount();
});

test('E: bold={false} は span 要素で、太字にならない', async () => {
    const view = await renderEm({bold: false});
    assert.deepEqual(view.problems, []);
    assert.equal(view.em.tagName, 'SPAN');
    assert.ok(!isBold(view.em), '太字でない');
    assert.ok(!/font-weight/.test(declarations(view.em)), 'font-weight を指定しない');
    await view.unmount();
});

test('E: underline で下線が付く(下線の色は文字色のまま、offset は 0.2em)', async () => {
    const view = await renderEm({underline: true});
    assert.deepEqual(view.problems, []);
    assert.equal(view.em.tagName, 'STRONG', 'bold は既定のまま');
    assert.ok(/underline/.test(getComputedStyle(view.em).textDecoration), '下線あり');
    assert.equal(getComputedStyle(view.em).textUnderlineOffset, '0.2em', 'offset は 0.2em');
    assert.ok(!/text-decoration-color/.test(declarations(view.em)), '下線の色は指定しない');
    await view.unmount();

    const off = await renderEm({underline: false});
    assert.ok(!/underline/.test(getComputedStyle(off.em).textDecoration));
    await off.unmount();
});

test('E: bold={false} と underline の組み合わせは、細字の下線(span)', async () => {
    const view = await renderEm({bold: false, underline: true, color: 'caution'});
    assert.deepEqual(view.problems, []);
    assert.equal(view.em.tagName, 'SPAN');
    assert.ok(!isBold(view.em));
    assert.ok(/underline/.test(getComputedStyle(view.em).textDecoration));
    assert.equal(getComputedStyle(view.em).color, toRgb(DEFAULT_THEME.palette.error.main));
    await view.unmount();
});

test('E: color="emphasis" は primary.main、"caution" は error.main の色になる', async () => {
    const emphasis = await renderEm({color: 'emphasis'});
    assert.deepEqual(emphasis.problems, []);
    assert.equal(getComputedStyle(emphasis.em).color, toRgb(DEFAULT_THEME.palette.primary.main));
    assert.ok(/(^|[\s;])color:/.test(declarations(emphasis.em)), 'declarations() は color の指定を読める(「色を変えない」の確認が空振りでない)');
    await emphasis.unmount();

    const caution = await renderEm({color: 'caution'});
    assert.deepEqual(caution.problems, []);
    assert.equal(getComputedStyle(caution.em).color, toRgb(DEFAULT_THEME.palette.error.main));
    await caution.unmount();

    assert.notEqual(DEFAULT_THEME.palette.primary.main, DEFAULT_THEME.palette.error.main, '2 つは別の色');
});

test('E: 名前以外の値は、そのまま sx の color に渡る(\'#c00\'、\'text.secondary\')', async () => {
    const hex = await renderEm({color: '#c00'});
    assert.deepEqual(hex.problems, []);
    assert.equal(getComputedStyle(hex.em).color, 'rgb(204, 0, 0)');
    await hex.unmount();

    const palette = await renderEm({color: 'text.secondary'});
    assert.deepEqual(palette.problems, []);
    assert.equal(getComputedStyle(palette.em).color, 'rgba(0, 0, 0, 0.6)');
    await palette.unmount();

    // Object のプロパティ名('toString' など)を色の名前と取り違えない
    const proto = await renderEm({color: 'toString'});
    assert.deepEqual(proto.problems, []);
    assert.equal(proto.em.tagName, 'STRONG');
    await proto.unmount();
});

test('E: ThemeProvider でパレットを変えると、emphasis と caution の色も変わる', async () => {
    const emphasis = await renderEm({color: 'emphasis'}, '強調', withTheme(CUSTOM_THEME));
    assert.deepEqual(emphasis.problems, []);
    assert.equal(getComputedStyle(emphasis.em).color, 'rgb(18, 52, 86)', 'primary.main = #123456');
    await emphasis.unmount();

    const caution = await renderEm({color: 'caution'}, '注意', withTheme(CUSTOM_THEME));
    assert.deepEqual(caution.problems, []);
    assert.equal(getComputedStyle(caution.em).color, 'rgb(101, 67, 33)', 'error.main = #654321');
    await caution.unmount();

    const raw = await renderEm({color: '#c00'}, '値', withTheme(CUSTOM_THEME));
    assert.equal(getComputedStyle(raw.em).color, 'rgb(204, 0, 0)', '名前以外の値はテーマに左右されない');
    await raw.unmount();
});

test('E: P の中に置くと、P の中のインライン要素になる', async () => {
    const view = await render(
        h(tion.P, null, '前、', h(tion.E, {color: 'caution'}, '必ず確認する'), '。後'));
    assert.deepEqual(view.problems, []);

    const p = view.container.firstElementChild;
    const em = p.querySelector('strong');
    assert.equal(em.parentElement, p, 'P の直接の子');
    assert.equal(p.textContent, '前、必ず確認する。後');
    assert.deepEqual([...p.childNodes].map((n) => n.nodeName), ['#text', 'STRONG', '#text'], '文の途中に入る');
    assert.equal(getComputedStyle(em).display, 'inline');
    assert.ok(!/display/.test(declarations(em)), 'display は指定していない');
    await view.unmount();

    const span = await render(h(tion.P, null, h(tion.E, {bold: false, underline: true}, 'ただし'), '、…'));
    assert.deepEqual(span.problems, []);
    const el = span.container.querySelector('p, div > span');
    assert.equal(el.tagName, 'SPAN');
    assert.equal(getComputedStyle(el).display, 'inline');
    assert.ok(!/display/.test(declarations(el)));
    await span.unmount();
});

test('E: S の中(Typography の p)にも置ける', async () => {
    const view = await render(h(tion.S, null, '前', h(tion.E, null, '強調'), '後'));
    assert.deepEqual(view.problems, []);
    const s = view.container.firstElementChild;
    assert.equal(s.querySelector('strong').parentElement, s);
    assert.equal(s.textContent, '前強調後');
    await view.unmount();
});

test('E: sx は既定のスタイルの後に重ねられる', async () => {
    const view = await renderEm({color: 'caution', sx: {backgroundColor: 'red', color: '#00f', fontWeight: 'normal'}});
    assert.deepEqual(view.problems, []);
    const style = getComputedStyle(view.em);
    assert.equal(style.backgroundColor, 'rgb(255, 0, 0)', 'sx の値が効く');
    assert.equal(style.color, 'rgb(0, 0, 255)', 'color の指定を sx が上書きできる');
    assert.ok(!isBold(view.em), '既定の太字を sx が上書きできる');
    await view.unmount();

    const keep = await renderEm({sx: {backgroundColor: 'red'}});
    assert.ok(isBold(keep.em), 'sx で触れていない既定の値は残る');
    await keep.unmount();
});

test('E: children は ReactNode(入れ子)でもよい', async () => {
    const view = await renderEm({}, ['a', h('i', {key: 'i', id: 'inner'}, 'b')]);
    assert.deepEqual(view.problems, []);
    assert.equal(view.em.querySelector('#inner').textContent, 'b');
    assert.equal(view.em.textContent, 'ab');
    await view.unmount();
});
