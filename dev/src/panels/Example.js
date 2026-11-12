import React from 'react';

import Container from '@mui/material/Container';

import {Check} from '../lib/index.js';

import {
    Section,
    Table,
    S,
    UL,
    OL,
    LI,
    LinkOS,
    Figure,
} from '../lib/index.js';

export default function Exsample (props) {
    return (
        <Container maxWidth="md" sx={{pt:8}}>

          <Section title="title A" num="1.">
            <S>Contents....</S>
            <S>Contents....</S>
            <S>Contents....</S>
            <S>Contents....</S>
            <S>Contents....</S>

            <S>
              <LinkOS href="https://mui.com/material-ui/react-link/"
                      onClick={(e)=>console.log(e)}>
                LinkOS
              </LinkOS>
            </S>

            {/* <S> */}
            {/*   <LinkRR href="/" */}
            {/*           onClick={(e)=>console.log(e)}> */}
            {/*     LinkRR */}
            {/*   </LinkRR> */}
            {/* </S> */}

            <Figure src="/logo192.png"
                    alt="tion のロゴ"
                    caption="図 1: Figure(caption あり。画像は元の大きさで表示される)"/>

            <Section title="title A" lev="5" num="a)">
              <S>Contents....</S>
              <Table columns={columns}
                     rows={rows}
                     ids={{column: (col,i)=> i, row: (row,i)=> i}}
                     sx={{
                         head: {
                             background:'#f2f2b0',
                             row: {},
                         },
                         body: {
                             row: {},
                         },
                     }}/>

              <Section title="title B" lev="6" num="i)">
                <S>Contents....</S>

                <Section title="title C" lev="7" num="(1)">
                  <S>Contents.... (lev 7: h6 の要素のまま、小さい太字)</S>

                  <Section title="title D" lev="8" num="(a)">
                    <S>Contents.... (lev 8)</S>
                  </Section>
                </Section>
              </Section>
            </Section>

          </Section>

          <Section title="リスト" num="2.">
            <Section title="箇条書き(UL)" lev="5" num="a)">
              <UL>
                <LI>短い項目</LI>
                <LI>2 行以上に折り返す長い項目です。記号は行の外に出るので、2 行目以降は本文の頭にそろいます(ぶら下げの字下げ)。幅を狭めたり、文字を足したりして、折り返した行の頭がそろっているかを確かめてください。</LI>
                <LI>入れ子の親の項目
                  <UL>
                    <LI>子の項目</LI>
                    <LI>子の項目も、2 行以上に折り返すと 2 行目以降がこの本文の頭にそろいます。折り返した行がどこから始まるかを見てください。</LI>
                    <LI>さらに入れ子にした項目
                      <UL>
                        <LI>孫の項目</LI>
                      </UL>
                    </LI>
                  </UL>
                </LI>
                <LI>最後の項目</LI>
              </UL>
              <S>リストの直後の文章です。リストの下の余白は、段落(P)と同じ mb: 1 です。</S>
            </Section>

            <Section title="番号つきリスト(OL)" lev="5" num="b)">
              <OL>
                <LI>1 番目の項目</LI>
                <LI>2 行以上に折り返す長い項目です。番号はブラウザが自動で振り、折り返した行は番号の右の本文の頭にそろいます。番号の幅が広がっても、本文の頭はそろいます。</LI>
                <LI>入れ子の親の項目
                  <OL>
                    <LI>子の項目</LI>
                    <LI>子の項目も、番号が 1 から振り直されます。2 行以上に折り返しても、本文の頭にそろいます。</LI>
                  </OL>
                </LI>
                <LI>4 番目の項目</LI>
              </OL>
            </Section>

            <Section title="箇条書きと番号つきリストの入れ子" lev="5" num="c)">
              <UL>
                <LI>箇条書きの中に、番号つきリストを置く
                  <OL>
                    <LI>手順 1</LI>
                    <LI>手順 2</LI>
                  </OL>
                </LI>
                <LI>別の項目</LI>
              </UL>
              <OL>
                <LI>番号つきリストの中に、箇条書きを置く
                  <UL>
                    <LI>補足 A</LI>
                    <LI>補足 B</LI>
                  </UL>
                </LI>
                <LI>別の項目</LI>
              </OL>
            </Section>

            <Section title="開始番号(start)と記号の形(sx)" lev="5" num="d)">
              <OL start={5}>
                <LI>start={'{5}'} なので、5 から始まる</LI>
                <LI>次の項目は 6</LI>
              </OL>
              <UL sx={{listStyleType: 'square'}}>
                <LI>sx の listStyleType で、記号を四角にした</LI>
                <LI>次の項目</LI>
              </UL>
              <OL sx={{listStyleType: 'lower-alpha'}}>
                <LI>sx の listStyleType で、番号を英字にした</LI>
                <LI>次の項目</LI>
              </OL>
            </Section>
          </Section>

          <Section title="チェックリスト" num="3.">
            <Section title="表示だけ(onChange なし)" lev="5" num="a)">
              <Check title="バックアップを取った" checked>
                作業の前日までに、全データのバックアップを取る。
              </Check>
              <Check title="手順書を更新した">
                onChange を渡さないと表示だけになり、クリックしても変わらない。
              </Check>
              <Check title="説明なしの項目(チェック済み)" checked/>
              <Check title="説明なしの項目(未チェック)"/>
            </Section>

            <Section title="操作できる(onChange あり)" lev="5" num="b)">
              <Checklist/>
            </Section>

            <Section title="長い説明は折り返す" lev="5" num="c)">
              <Check title="説明が 2 行以上に折り返す項目" checked>
                説明の左端は title の左端にそろいます。幅を狭めたり、文字を足したりして、折り返した行が title の頭にそろっているか、Checkbox が title の 1 行目の高さに来ているかを確かめてください。説明の中には、段落や箇条書きも置けます。
                <UL sx={{mt: 0.5}}>
                  <LI>説明の中の項目 1</LI>
                  <LI>説明の中の項目 2</LI>
                </UL>
              </Check>
              <Check title="title が長いときは、2 行以上に折り返しても、Checkbox は title の 1 行目にそろう。title が長いときは、2 行以上に折り返しても、Checkbox は title の 1 行目にそろう。"/>
            </Section>
          </Section>

        </Container>
    );
}

// onChange を渡して、操作できるようにしたチェックリスト。
function Checklist () {
    const [items, setItems] = React.useState([
        { code: 'a', title: '関係者に連絡した',  done: true  },
        { code: 'b', title: '作業の手順を確認した', done: false, desc: 'title をクリックしても、切り替わります。' },
        { code: 'c', title: '切り戻しの手順を用意した', done: false },
    ]);

    const toggle = (code, done) =>
          setItems((list)=> list.map((item)=> item.code===code ? {...item, done} : item));

    return (
        <>
          {items.map((item)=> (
              <Check key={item.code}
                     title={item.title}
                     checked={item.done}
                     onChange={(v)=> toggle(item.code, v)}>
                {item.desc}
              </Check>
          ))}
          <S>{items.filter((item)=> item.done).length} / {items.length} 件が完了</S>
        </>
    );
}

const columns = [
    { code: 'a', label: 'A',  key: 'a' },
    { code: 'b', label: 'B',  val: (row)=> row.b },
    { code: 'c', label: 'C',  val: (row)=> row.b * row.c },
];

const rows = [
    { a:  1, b:  2, c:  3 },
    { a:  6, b:  7, c:  8 },
    { a: 11, b: 12, c: 13 },
];
