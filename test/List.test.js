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
