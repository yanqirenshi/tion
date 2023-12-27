import React from 'react';

import Box from '@mui/material/Box';

import {Masonry} from '../lib/index.js';

export default function MasonryLayout (props) {
    const masonryOptions = {
        transitionDuration: 0,
    };

    const imagesLoadedOptions = {
        background: '.my-bg-image-el',
    };

    return (
        <Box>
          <Masonry className={'my-gallery-class'} /* default '' */
                   elementType={'div'} /* default 'div' */
                   options={masonryOptions} /* default {} */
                   disableImagesLoaded={false} /* default false */
                   updateOnEachImageLoad={false} /* default false and works only if disableImagesLoaded is false */
                   imagesLoadedOptions={imagesLoadedOptions}> {/* default {} */}
          </Masonry>
        </Box>
    );
}
