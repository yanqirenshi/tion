'use strict';

// UL・OL・LI(箇条書き・番号つきリスト)のテスト。
// jsdom の準備と、警告を失敗として扱う描画の仕方は test/components.test.js と同じ。
//   既定: ../dist を検証する。
//   別の組み合わせでは、TION_DIST=<tion の dist のパス> を指定する。

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
const {UL, OL, LI} = tion;

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

const style = (el) => getComputedStyle(el);

test('UL・OL・LI は tion から export される', () => {
    for (const component of [UL, OL, LI]) {
        assert.equal(typeof component, 'function');
    }
});

test('UL は ul、OL は ol、LI は li の要素になり、警告が出ない', async () => {
    const view = await render(h(React.Fragment, null,
                                h(UL, null, h(LI, null, 'ul-item')),
                                h(OL, null, h(LI, null, 'ol-item'))));
    assert.deepEqual(view.problems, [], '警告・エラーが出ていない');

    const ul = view.container.querySelector('ul');
    const ol = view.container.querySelector('ol');
    assert.ok(ul, 'ul 要素がある');
    assert.ok(ol, 'ol 要素がある');
    assert.equal(ul.querySelector(':scope > li').textContent, 'ul-item');
    assert.equal(ol.querySelector(':scope > li').textContent, 'ol-item');
    assert.equal(view.container.querySelectorAll('li').length, 2);
    await view.unmount();
});

test('OL の start は ol の start 属性になる。UL と、start なしの OL には付かない', async () => {
    const view = await render(h(React.Fragment, null,
                                h(OL, {start: 5}, h(LI, null, 'a')),
                                h(OL, null, h(LI, null, 'b')),
                                h(UL, null, h(LI, null, 'c'))));
    assert.deepEqual(view.problems, []);

    const [withStart, withoutStart] = view.container.querySelectorAll('ol');
    assert.equal(withStart.getAttribute('start'), '5');
    assert.equal(withoutStart.hasAttribute('start'), false);
    assert.equal(view.container.querySelector('ul').hasAttribute('start'), false);
    await view.unmount();
});

test('LI の中に入れ子にした ol・ul は、li の中にある', async () => {
    const view = await render(
        h(UL, null,
          h(LI, null, '項目'),
          h(LI, null, '親の項目',
            h(OL, null, h(LI, null, '子の項目')))));
    assert.deepEqual(view.problems, []);

    const parent = view.container.querySelectorAll(':scope > ul > li')[1];
    assert.ok(parent.querySelector(':scope > ol'), '親の li の直下に ol がある');
    assert.equal(parent.querySelector(':scope > ol > li').textContent, '子の項目');
    assert.equal(view.container.querySelectorAll('li').length, 3);
    await view.unmount();
});

test('UL・OL・LI の既定のスタイル', async () => {
    const view = await render(h(React.Fragment, null,
                                h(UL, null, h(LI, null, 'a')),
                                h(OL, null, h(LI, null, 'b'))));
    assert.deepEqual(view.problems, []);

    for (const list of view.container.querySelectorAll('ul, ol')) {
        const s = style(list);
        assert.equal(s.marginTop, '0px', `${list.tagName}: m: 0`);
        assert.equal(s.marginBottom, '8px', `${list.tagName}: mb: 1`);
        assert.equal(s.paddingLeft, '24px', `${list.tagName}: pl: 3`);
        assert.equal(s.fontSize, '1rem', `${list.tagName}: typography: body1`);
        assert.equal(s.listStylePosition === '' || s.listStylePosition === 'outside', true, `${list.tagName}: 記号は行の外`);
    }
    for (const item of view.container.querySelectorAll('li')) {
        assert.equal(style(item).marginBottom, '4px', 'li: mb: 0.5');
    }
    await view.unmount();
});

test('LI の中に入れ子にした UL・OL は、mt: 0.5(4px)、mb: 0 になる', async () => {
    const view = await render(
        h(UL, null,
          h(LI, null, '親',
            h(OL, null, h(LI, null, '子 1', h(UL, null, h(LI, null, '孫')))))));
    assert.deepEqual(view.problems, []);

    const top = view.container.querySelector(':scope > ul');
    assert.equal(style(top).marginTop, '0px');
    assert.equal(style(top).marginBottom, '8px');

    for (const nested of view.container.querySelectorAll('li ul, li ol')) {
        assert.equal(style(nested).marginTop, '4px', `${nested.tagName}: mt: 0.5`);
        assert.equal(style(nested).marginBottom, '0px', `${nested.tagName}: mb: 0`);
        assert.equal(style(nested).paddingLeft, '24px', `${nested.tagName}: pl: 3 のまま`);
    }
    await view.unmount();
});

test('sx は既定のスタイルの後に重なり、既定を上書きできる(オブジェクトでも配列でも)', async () => {
    const view = await render(h(React.Fragment, null,
                                h(UL, {sx: {color: 'red', pl: 5}}, h(LI, {sx: {color: 'blue'}}, 'a')),
                                h(OL, {sx: [{color: 'red'}, {pl: 5}]}, h(LI, {sx: [{color: 'blue'}, {mb: 2}]}, 'b'))));
    assert.deepEqual(view.problems, []);

    for (const list of view.container.querySelectorAll('ul, ol')) {
        assert.equal(style(list).color, 'rgb(255, 0, 0)', `${list.tagName}: sx の color`);
        assert.equal(style(list).paddingLeft, '40px', `${list.tagName}: sx が pl を上書き`);
        assert.equal(style(list).marginBottom, '8px', `${list.tagName}: sx にない既定は残る`);
    }
    const [liUl, liOl] = view.container.querySelectorAll('li');
    assert.equal(style(liUl).color, 'rgb(0, 0, 255)');
    assert.equal(style(liUl).marginBottom, '4px', 'sx にない既定は残る');
    assert.equal(style(liOl).color, 'rgb(0, 0, 255)');
    assert.equal(style(liOl).marginBottom, '16px', 'sx が mb を上書き');
    await view.unmount();
});

test('入れ子にした UL・OL の sx は、入れ子用の既定値より優先される', async () => {
    const view = await render(
        h(UL, null,
          h(LI, null, '親', h(UL, {sx: {mt: 3, mb: 2}}, h(LI, null, '子')))));
    assert.deepEqual(view.problems, []);

    const nested = view.container.querySelector('li ul');
    assert.equal(style(nested).marginTop, '24px');
    assert.equal(style(nested).marginBottom, '16px');
    await view.unmount();
});

test('listStyleType は sx で変えられる', async () => {
    const view = await render(h(UL, {sx: {listStyleType: 'square'}}, h(LI, null, 'a')));
    assert.deepEqual(view.problems, []);
    assert.equal(style(view.container.querySelector('ul')).listStyleType, 'square');
    await view.unmount();
});

test('children を省略しても、sx を省略しても警告が出ない', async () => {
    const view = await render(h(React.Fragment, null, h(UL), h(OL), h(UL, null, h(LI))));
    assert.deepEqual(view.problems, []);
    assert.equal(view.container.querySelectorAll('li').length, 1);
    await view.unmount();
});

// ---- 記号と番号の種類を、既定で明示する(CSS のリセットで消えないようにする) ----

// Bulma などの CSS のリセット(要素セレクタ)。
//   ul, ol { list-style: none; } と li { display: block; } が、実際のリセットで使われる形。
// jsdom は、list-style の一括指定を list-style-type などに展開せず、
// 既定のスタイルシート(ul ul { circle } など)を作者のスタイルより強く扱う(ブラウザは逆)。
// そのため、ブラウザで起きること(記号が消える)を再現するために、長い指定と入れ子のセレクタも書く。
const RESET_CSS = [
    'ul, ol { list-style: none; }',
    'li { display: block; }',
    'ul, ol, ul ul, ul ol, ol ul, ol ol { list-style-type: none; list-style-position: inside; }',
].join('\n');

// リセットの style を head に入れて、止めたときに取り除く関数を返す。
// where: 'prepend'(tion の style より前)・'append'(後)。要素セレクタは詳細度が低いので、どちらでも tion が勝つ。
function installReset (where) {
    const el = document.createElement('style');
    el.setAttribute('data-test-reset', '');
    el.textContent = RESET_CSS;
    if (where === 'prepend')
        document.head.prepend(el);
    else
        document.head.appendChild(el);
    return () => el.remove();
}

// UL・OL を深さ順に入れ子にする。tags は ['ul', 'ul', 'ol'] のような配列。一番内側に本文を置く。
function nest (tags, text = 'leaf') {
    const [tag, ...rest] = tags;
    const List = tag === 'ol' ? OL : UL;
    return h(List, null, h(LI, null, rest.length ? nest(rest, text) : text));
}

const markers = (container) => [...container.querySelectorAll('ul, ol')].map((list) => style(list).listStyleType);

// リセットあり(style を前後 2 通りに入れる)と、なしの両方で、同じ値になる。
const CASES = [
    {label: 'リセットあり(tion の style より前)', where: 'prepend'},
    {label: 'リセットあり(tion の style より後)', where: 'append'},
    {label: 'リセットなし', where: null},
];

for (const {label, where} of CASES) {
    test(`記号と番号: ${label}`, async (t) => {
        const uninstall = where ? installReset(where) : () => {};
        try {
            await t.test('UL は、深さ 1・2・3・4 で disc・circle・square・square', async () => {
                const view = await render(nest(['ul', 'ul', 'ul', 'ul']));
                assert.deepEqual(view.problems, [], '警告・エラーが出ていない');
                assert.deepEqual(markers(view.container), ['disc', 'circle', 'square', 'square']);
                await view.unmount();
            });

            await t.test('OL の中の UL は circle(深さは UL と OL を区別せずに数える)', async () => {
                const view = await render(nest(['ol', 'ul', 'ul']));
                assert.deepEqual(view.problems, []);
                assert.deepEqual(markers(view.container), ['decimal', 'circle', 'square']);
                await view.unmount();
            });

            await t.test('UL の中の OL は decimal', async () => {
                const view = await render(nest(['ul', 'ol', 'ul', 'ol']));
                assert.deepEqual(view.problems, []);
                assert.deepEqual(markers(view.container), ['disc', 'decimal', 'square', 'decimal']);
                await view.unmount();
            });

            await t.test('OL は、深さに関係なく decimal', async () => {
                const view = await render(nest(['ol', 'ol', 'ol', 'ol']));
                assert.deepEqual(view.problems, []);
                assert.deepEqual(markers(view.container), ['decimal', 'decimal', 'decimal', 'decimal']);
                await view.unmount();
            });

            await t.test('深さは、兄弟のリストにも、LI にも持ち越されない', async () => {
                const view = await render(h(React.Fragment, null,
                                            h(UL, null, h(LI, null, 'a', h(UL, null, h(LI, null, 'b'))), h(LI, null, 'c', h(UL, null, h(LI, null, 'd')))),
                                            h(UL, null, h(LI, null, 'e')),
                                            h(OL, null, h(LI, null, 'f'))));
                assert.deepEqual(view.problems, []);
                // 1 つ目の UL(disc)の中の 2 つの UL は、どちらも circle。後ろの UL は disc、OL は decimal。
                assert.deepEqual(markers(view.container), ['disc', 'circle', 'circle', 'disc', 'decimal']);
                await view.unmount();
            });

            await t.test('listStylePosition は outside、LI の display は list-item', async () => {
                const view = await render(nest(['ul', 'ol', 'ul']));
                assert.deepEqual(view.problems, []);
                for (const list of view.container.querySelectorAll('ul, ol')) {
                    assert.equal(style(list).listStylePosition, 'outside', `${list.tagName}: 記号は行の外`);
                }
                for (const item of view.container.querySelectorAll('li')) {
                    assert.equal(style(item).display, 'list-item', 'li: display: list-item');
                }
                await view.unmount();
            });

            await t.test('sx の listStyleType は、既定より優先される', async () => {
                const view = await render(h(React.Fragment, null,
                                            h(UL, {sx: {listStyleType: 'square'}}, h(LI, null, 'a')),
                                            h(OL, {sx: [{listStyleType: 'lower-alpha'}]}, h(LI, null, 'b')),
                                            h(UL, {sx: {listStyleType: 'none'}}, h(LI, null, 'c'))));
                assert.deepEqual(view.problems, []);
                assert.deepEqual(markers(view.container), ['square', 'lower-alpha', 'none']);
                await view.unmount();
            });

            await t.test('外側の sx で listStyleType を変えても、入れ子の UL・OL は既定のまま', async () => {
                const view = await render(h(React.Fragment, null,
                                            h(UL, {sx: {listStyleType: 'square'}}, h(LI, null, 'a', h(UL, null, h(LI, null, 'b')))),
                                            h(OL, {sx: {listStyleType: 'upper-roman'}}, h(LI, null, 'c', h(OL, null, h(LI, null, 'd')), h(UL, null, h(LI, null, 'e'))))));
                assert.deepEqual(view.problems, []);
                // 外側は sx の値。入れ子は、深さに応じた既定(UL の深さ 2 は circle、OL は decimal)。
                assert.deepEqual(markers(view.container), ['square', 'circle', 'upper-roman', 'decimal', 'circle']);
                await view.unmount();
            });

            await t.test('入れ子の UL・OL 自身の sx は、既定より優先される', async () => {
                const view = await render(h(UL, null, h(LI, null, 'a', h(UL, {sx: {listStyleType: 'square'}}, h(LI, null, 'b')))));
                assert.deepEqual(view.problems, []);
                assert.deepEqual(markers(view.container), ['disc', 'square']);
                await view.unmount();
            });
        } finally {
            uninstall();
        }
        assert.equal(document.querySelectorAll('[data-test-reset]').length, 0, '入れたリセットの style を取り除いた');
    });
}

test('リセットの style は、テストのあとに残らない', () => {
    assert.equal(document.querySelectorAll('[data-test-reset]').length, 0);
});
