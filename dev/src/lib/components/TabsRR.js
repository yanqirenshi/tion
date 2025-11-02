import * as React from 'react';
import { useSearchParams } from "react-router-dom";

import Box from '@mui/material/Box';
import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';

export default function Tabs2 (props) {
    const data = props.data;
    const onChange = props.onChange;

    let [searchParams, setSearchParams] = useSearchParams();

    const url_tab_code = searchParams.get('tab') || null;

    const updateTabs = (v)=> {
        const new_data = {...data};
        new_data.selected = v;
        onChange(new_data);
    };

    const updateSerchParams = (v)=> {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', v);
        setSearchParams(newParams);
    };

    React.useEffect(()=> {
        fixTabsSelected (data, url_tab_code, updateTabs, updateSerchParams);
    }, [url_tab_code]);

    const change = (e,v)=> {
        if (!onChange) return;
        updateSerchParams(v);
        updateTabs(v);
    };

    const tab = url_tab_code || data.selected || data.list[0].code;

    return (
        <Box sx={{background:'#f8f8f8'}}>

          <MuiTabs value={tab}
                   onChange={change}
                   centered>
            {data.list.map((tab)=> {
                return (
                    <MuiTab key={tab.code}
                            value={tab.code}
                            label={tab.label}/>
                );
            })}
          </MuiTabs>

        </Box>
    );
}

function fixTabsSelected (data, url_tab_code, updateTabs, updateSerchParams) {
    if (url_tab_code===null) {
        // url でタブがセットされていない場合
        const first_tab_code = data.list[0].code;
        const selected = data.selected;

        if (selected) {
            // selected がセットされていた場合
            if (selected===first_tab_code) {
                // selected と first_tab_code が同じ場合、なにもしない。
            } else {
                // selected と first_tab_code が異なる場合、serch_param を更新する。
                updateSerchParams(selected);
            }
        } else {
            // selected がセットされていない場合
            updateTabs(first_tab_code);
        }
    } else {
        // url でタブがセットされている場合
        const first_tab_code = data.list[0].code;
        const selected = data.selected;

        if (selected) {
            // selected がセットされていた場合
            if (selected===url_tab_code) {
                // selected と url_tab_code が同じ場合
                // なにもしない。
            } else {
                // selected と url_tab_code が異なる場合
                updateTabs(url_tab_code);
            }
        } else {
            // selected がセットされていない場合
            updateTabs(url_tab_code);
        }
    }
}
