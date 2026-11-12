'use strict';

// Check(チェック項目)のテスト。
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
const {Check} = tion;

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
        // 同じ root に描き直す(props を変えて確かめるとき)。
        rerender: async (next) => { await act(async () => { root.render(next); }); },
        unmount: async () => { await act(async () => root.unmount()); container.remove(); },
    };
}

// クリックは act の中で行う。警告も拾う。
async function click (el) {
    const problems = [];
    const original = {error: console.error, warn: console.warn};
    console.error = (...args) => problems.push(args.map(String).join(' '));
    console.warn = (...args) => problems.push(args.map(String).join(' '));
    try {
        await act(async () => { el.click(); });
    } finally {
        console.error = original.error;
        console.warn = original.warn;
    }
    return problems;
}

const style = (el) => getComputedStyle(el);
const inputOf = (container) => container.querySelector('input[type=checkbox]');
const labelOf = (container) => container.querySelector('label');

test('Check は tion から export される', () => {
    assert.equal(typeof Check, 'function');
});

// ---- 構成 ----

test('checkbox の input が 1 つあり、checked のとおりの状態になる(既定は未チェック)', async () => {
    for (const [props, expected] of [[{checked: true}, true], [{checked: false}, false], [{}, false], [{checked: undefined}, false]]) {
        const view = await render(h(Check, {title: 't', ...props}));
        assert.deepEqual(view.problems, [], '警告・エラーが出ていない');
        assert.equal(view.container.querySelectorAll('input[type=checkbox]').length, 1);
        assert.equal(inputOf(view.container).checked, expected, JSON.stringify(props));
        await view.unmount();
    }
});

test('title は label になり、htmlFor で checkbox の input と結びつく', async () => {
    const view = await render(h(Check, {title: '項目名'}));
    assert.deepEqual(view.problems, []);

    const label = labelOf(view.container);
    const input = inputOf(view.container);
    assert.ok(label, 'label 要素がある');
    assert.equal(label.textContent, '項目名');
    assert.ok(input.id, 'input に id が付いている');
    assert.equal(label.htmlFor, input.id, 'label の htmlFor が input の id');
    assert.equal(document.getElementById(label.htmlFor), input, 'label から input をたどれる');
    assert.deepEqual([...input.labels], [label], 'input から label をたどれる');
    await view.unmount();
});

test('Check を並べても、id は項目ごとに別になる', async () => {
    const view = await render(h(React.Fragment, null,
                                h(Check, {title: 'a'}), h(Check, {title: 'b'}), h(Check, {title: 'c'})));
    assert.deepEqual(view.problems, []);

    const ids = [...view.container.querySelectorAll('input')].map((i) => i.id);
    assert.equal(new Set(ids).size, 3);
    const labels = [...view.container.querySelectorAll('label')];
    labels.forEach((label, i) => assert.equal(label.htmlFor, ids[i]));
    await view.unmount();
});

test('title には ReactNode を渡せる', async () => {
    const view = await render(h(Check, {title: h('span', {id: 'rich'}, 'リッチ ', h('b', null, '太字'))}));
    assert.deepEqual(view.problems, []);
    assert.equal(labelOf(view.container).querySelector('#rich b').textContent, '太字');
    await view.unmount();
});

test('children(説明)は title の下に出る。省略もできる', async () => {
    const view = await render(h(React.Fragment, null,
                                h(Check, {title: 'あり'}, h('span', {id: 'desc'}, '説明の文')),
                                h(Check, {title: 'なし'})));
    assert.deepEqual(view.problems, []);

    const [withDesc, withoutDesc] = [...view.container.children];

    const label = labelOf(withDesc);
    const desc = withDesc.querySelector('#desc');
    assert.ok(desc, '説明が出る');
    assert.equal(desc.textContent, '説明の文');
    assert.equal(label.nextElementSibling.contains(desc), true, '説明は title の直後(下)にある');
    assert.equal(label.parentElement.contains(desc), true, '説明は title と同じ本文の枠の中にある');
    assert.equal(label.compareDocumentPosition(desc) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING, dom.window.Node.DOCUMENT_POSITION_FOLLOWING);

    assert.equal(labelOf(withoutDesc).parentElement.children.length, 1, '説明なしなら、本文の枠には title だけ');
    assert.equal(withoutDesc.textContent, 'なし');
    await view.unmount();
});

test('children が空でも(null・false・undefined)、説明の枠は出ない', async () => {
    for (const children of [null, false, undefined]) {
        const view = await render(h(Check, {title: 't'}, children));
        assert.deepEqual(view.problems, []);
        assert.equal(labelOf(view.container).parentElement.children.length, 1);
        await view.unmount();
    }
});

test('説明の左端は title の左端にそろう(同じ本文の枠の中に、縦に並ぶ)', async () => {
    const view = await render(h(Check, {title: 't'}, '説明'));
    const label = labelOf(view.container);
    const body = label.parentElement;
    assert.equal(style(body).flexGrow, '1', '本文の枠は flex: 1');
    assert.equal(style(body).minWidth, '0px', '本文の枠は minWidth: 0');
    assert.equal(label.nextElementSibling.parentElement, body);
    await view.unmount();
});

// ---- 操作できるとき(onChange あり) ----

test('onChange があると、クリックで (checked, event) の順に 1 回呼ばれる', async () => {
    const calls = [];
    const view = await render(h(Check, {title: 't', checked: false, onChange: (...args) => calls.push(args)}));
    assert.deepEqual(view.problems, []);

    const problems = await click(inputOf(view.container));
    assert.deepEqual(problems, [], '警告・エラーが出ていない');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].length, 2);
    assert.equal(calls[0][0], true, '1 つ目は新しい checked');
    assert.equal(calls[0][1].type, 'change', '2 つ目は event');
    assert.equal(calls[0][1].target, inputOf(view.container));
    await view.unmount();
});

test('チェック済みの項目をクリックすると、false で呼ばれる', async () => {
    const calls = [];
    const view = await render(h(Check, {title: 't', checked: true, onChange: (v) => calls.push(v)}));
    await click(inputOf(view.container));
    assert.deepEqual(calls, [false]);
    await view.unmount();
});

test('title の label をクリックしても、onChange が呼ばれる', async () => {
    const calls = [];
    const view = await render(h(Check, {title: 'ラベル', checked: false, onChange: (v) => calls.push(v)}));

    const problems = await click(labelOf(view.container));
    assert.deepEqual(problems, []);
    assert.deepEqual(calls, [true]);
    await view.unmount();
});

test('制御されたコンポーネント: checked を親が変えるまで、見た目は変わらない', async () => {
    const calls = [];
    const view = await render(h(Check, {title: 't', checked: false, onChange: (v) => calls.push(v)}));
    const input = inputOf(view.container);

    await click(input);
    assert.equal(input.checked, false, '親が checked を変えていないので、未チェックのまま');
    await click(input);
    assert.deepEqual(calls, [true, true], '何度押しても、今の checked の反対が渡る');

    await view.rerender(h(Check, {title: 't', checked: true, onChange: (v) => calls.push(v)}));
    assert.equal(input.checked, true, '親が checked を変えると、表示が変わる');
    await view.unmount();
});

test('親の state につなぐと、クリックで切り替わる', async () => {
    function Wrapper () {
        const [done, setDone] = React.useState(false);
        return h(Check, {title: 't', checked: done, onChange: (v) => setDone(v)});
    }
    const view = await render(h(Wrapper));
    const input = inputOf(view.container);

    assert.equal(input.checked, false);
    await click(input);
    assert.equal(input.checked, true);
    await click(labelOf(view.container));
    assert.equal(input.checked, false);
    await view.unmount();
});

test('onChange があるときは、aria-readonly が付かず、disabled でもない', async () => {
    const view = await render(h(Check, {title: 't', onChange: () => {}}));
    const input = inputOf(view.container);
    assert.equal(input.hasAttribute('aria-readonly'), false);
    assert.equal(input.disabled, false);
    await view.unmount();
});

// ---- 表示だけのとき(onChange なし) ----

test('onChange が無いと、クリックしても状態が変わらず、警告も出ない', async () => {
    for (const checked of [false, true]) {
        const view = await render(h(Check, {title: 't', checked}));
        const input = inputOf(view.container);

        let problems = await click(input);
        assert.deepEqual(problems, [], '警告・エラーが出ていない');
        assert.equal(input.checked, checked, 'input をクリックしても変わらない');

        problems = await click(labelOf(view.container));
        assert.deepEqual(problems, []);
        assert.equal(input.checked, checked, 'label をクリックしても変わらない');
        await view.unmount();
    }
});

test('onChange が無いと、input に aria-readonly="true" が付き、disabled にはならない', async () => {
    const view = await render(h(Check, {title: 't', checked: true}));
    const input = inputOf(view.container);
    assert.equal(input.getAttribute('aria-readonly'), 'true');
    assert.equal(input.disabled, false, 'disabled にしない(色が薄くなるため)');
    assert.equal(input.hasAttribute('disabled'), false);
    await view.unmount();
});

// マウスを押したときに出る ripple の要素。MUI は、押されるまで作らない。
async function pressDown (el) {
    await act(async () => { el.dispatchEvent(new dom.window.MouseEvent('mousedown', {bubbles: true, button: 0})); });
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
}

test('表示だけのときは、ripple を無効にし、カーソルは default にする', async () => {
    const view = await render(h(Check, {title: 't', checked: true}));
    const checkboxRoot = inputOf(view.container).parentElement;
    assert.equal(style(checkboxRoot).cursor, 'default');
    await pressDown(checkboxRoot);
    assert.equal(checkboxRoot.querySelector('.MuiTouchRipple-root'), null, '押しても ripple が出ない');
    await view.unmount();

    // 比べるため、操作できるときは、押すと ripple が出て、カーソルは MUI の既定(pointer)
    const live = await render(h(Check, {title: 't', checked: true, onChange: () => {}}));
    const liveRoot = inputOf(live.container).parentElement;
    assert.equal(style(liveRoot).cursor, 'pointer');
    await pressDown(liveRoot);
    assert.ok(liveRoot.querySelector('.MuiTouchRipple-root'), '押すと ripple が出る');
    await live.unmount();
});

test('onChange の有無が変わると、aria-readonly も付いたり外れたりする', async () => {
    const view = await render(h(Check, {title: 't'}));
    const input = inputOf(view.container);
    assert.equal(input.getAttribute('aria-readonly'), 'true');

    await view.rerender(h(Check, {title: 't', onChange: () => {}}));
    assert.equal(inputOf(view.container), input, 'input は作り直されない');
    assert.equal(input.hasAttribute('aria-readonly'), false);

    await view.rerender(h(Check, {title: 't'}));
    assert.equal(input.getAttribute('aria-readonly'), 'true');
    await view.unmount();
});

// ---- 見た目 ----

test('既定の見た目: 外側は flex(上そろえ・gap 8px・mb 12px)で、Checkbox の枠は高さ 1.5em', async () => {
    const view = await render(h(Check, {title: 't'}, '説明'));
    assert.deepEqual(view.problems, []);

    const outer = view.container.firstElementChild;
    assert.equal(style(outer).display, 'flex');
    assert.equal(style(outer).alignItems, 'flex-start');
    assert.equal(style(outer).columnGap === '8px' || style(outer).gap === '8px', true, 'gap: 1');
    assert.equal(style(outer).marginBottom, '12px', 'mb: 1.5');

    const box = inputOf(view.container).parentElement.parentElement;
    assert.equal(box.parentElement, outer);
    assert.equal(style(box).display, 'flex');
    assert.equal(style(box).alignItems, 'center');
    assert.equal(style(box).height, '1.5em');
    assert.equal(style(box).flexShrink, '0');

    assert.equal(style(inputOf(view.container).parentElement).padding, '0px', 'Checkbox は p: 0');
    assert.ok(inputOf(view.container).parentElement.className.includes('MuiCheckbox-sizeSmall'), 'size="small"');
    await view.unmount();
});

test('title は body1 の太字の label、説明は body1 で mt: 0.5(4px)', async () => {
    const view = await render(h(Check, {title: 't'}, '説明'));
    const label = labelOf(view.container);
    assert.equal(label.tagName, 'LABEL');
    assert.ok(label.classList.contains('MuiTypography-body1'));
    const weight = style(label).fontWeight;
    assert.ok(weight === 'bold' || Number(weight) >= 700, `太字: ${weight}`);
    assert.equal(style(label).display, 'block');

    const desc = label.nextElementSibling;
    assert.equal(style(desc).marginTop, '4px');
    assert.equal(style(desc).fontSize, '1rem');
    await view.unmount();
});

test('チェック済みでも、title や説明の見た目は変わらない(取り消し線などを付けない)', async () => {
    const on = await render(h(Check, {title: 't', checked: true}, '説明'));
    const off = await render(h(Check, {title: 't', checked: false}, '説明'));

    for (const [a, b] of [[labelOf(on.container), labelOf(off.container)],
                          [labelOf(on.container).nextElementSibling, labelOf(off.container).nextElementSibling]]) {
        assert.equal(style(a).textDecorationLine === '' || style(a).textDecorationLine === 'none', true, '取り消し線なし');
        for (const key of ['fontWeight', 'color', 'fontSize', 'opacity']) {
            assert.equal(style(a)[key], style(b)[key], key);
        }
        assert.equal(a.className, b.className);
    }
    await on.unmount();
    await off.unmount();
});

test('sx は外側の Box に、既定のスタイルの後に重なる(オブジェクトでも配列でも)', async () => {
    const view = await render(h(React.Fragment, null,
                                h(Check, {title: 'a', sx: {mb: 3, backgroundColor: 'red'}}),
                                h(Check, {title: 'b', sx: [{mb: 0}, {color: 'blue'}]}),
                                h(Check, {title: 'c'})));
    assert.deepEqual(view.problems, []);

    const [a, b, c] = view.container.children;
    assert.equal(style(a).marginBottom, '24px', 'sx が mb を上書き');
    assert.equal(style(a).backgroundColor, 'rgb(255, 0, 0)');
    assert.equal(style(a).display, 'flex', 'sx にない既定は残る');
    assert.equal(style(b).marginBottom, '0px');
    assert.equal(style(b).color, 'rgb(0, 0, 255)');
    assert.equal(style(c).marginBottom, '12px', 'sx なしは既定のまま');
    await view.unmount();
});

test('sx は、操作できるときも、表示だけのときも効く', async () => {
    for (const onChange of [undefined, () => {}]) {
        const view = await render(h(Check, {title: 't', onChange, sx: {mb: 2}}));
        assert.deepEqual(view.problems, []);
        assert.equal(style(view.container.firstElementChild).marginBottom, '16px');
        await view.unmount();
    }
});

test('Check の説明に UL・OL や段落を置いても、警告が出ない', async () => {
    const view = await render(h(Check, {title: 't', checked: true},
                                h('p', null, '段落'),
                                h(tion.UL, null, h(tion.LI, null, '項目'))));
    assert.deepEqual(view.problems, [], 'p を置いても、p の入れ子の警告が出ない');
    assert.ok(view.container.querySelector('ul li'));
    await view.unmount();
});
