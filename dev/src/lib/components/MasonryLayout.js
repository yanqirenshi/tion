import React from 'react';

// https://www.npmjs.com/package/masonry-layout
import Masonry from 'masonry-layout';

// https://www.npmjs.com/package/lodash
import assign   from 'lodash/assign';
import debounce from 'lodash/debounce';
import omit     from 'lodash/omit';
// https://www.npmjs.com/package/prop-types
import PropTypes from 'prop-types';
// https://www.npmjs.com/package/element-resize-detector
import elementResizeDetectorMaker from 'element-resize-detector';
// https://www.npmjs.com/package/imagesloaded
import imagesloaded from 'imagesloaded';

var propTypes = {
  enableResizableChildren: PropTypes.bool,
  disableImagesLoaded:     PropTypes.bool,
  onImagesLoaded:          PropTypes.func,
  updateOnEachImageLoad:   PropTypes.bool,
  options:                 PropTypes.object,
  imagesLoadedOptions:     PropTypes.object,
  elementType:             PropTypes.string,
  onLayoutComplete:        PropTypes.func,
  onRemoveComplete:        PropTypes.func
};

export default class MasonryLayout extends React.Component {
    constructor(props) {
        super(props);

        this.masonry = false;
        this.erd = undefined;
        this.latestKnownDomChildren = [];
        this.displayName = 'MasonryComponent';
        this.imagesLoadedCancelRef = undefined;
        this.propTypes = propTypes;

        this.masonryContainer = null;
    }
    /** ****************************************************************
     *  (1) ???
     *  参照: 
     * **************************************************************** */
    render() {
        const element_props = omit(this.props, Object.keys(propTypes));

        const type = this.props.elementType;
        // assign({}, props, {ref: this.setRef}),
        const props_ = assign({}, element_props, {ref: (n)=>this.masonryContainer = n});
        const children = this.props.children;

        return React.createElement(type, props_, children);
    }
    /** ****************************************************************
     *  (2) コンポーネントがマウントされた（ツリーに挿入された）直後に呼び出されます。
     *  参照: 
     * **************************************************************** */
    componentDidMount () {
        this.initializeMasonry();
        this.initializeResizableChildren();
        this.imagesLoaded();
    }
    /** ****************************************************************
     *  (3) 更新が行われた直後に componentDidUpdate() が呼び出されます。
     *  このメソッドは最初のレンダーでは呼び出されません。
     *  参照: 
     * **************************************************************** */
    componentDidUpdate (prevProps, prevState, snapshot) {
        this.performLayout();
        this.imagesLoaded();
    }
    /** ****************************************************************
     *  (4) コンポーネントがアンマウントされて破棄される直前に呼び出されます。
     *  参照: 
     * **************************************************************** */
    componentWillUnmount () {
        this.destroyErd();

        // unregister events
        if (this.props.onLayoutComplete) {
          this.masonry.off('layoutComplete', this.props.onLayoutComplete);
        }

        if (this.props.onRemoveComplete) {
          this.masonry.off('removeComplete', this.props.onRemoveComplete);
        }

        if (this.imagesLoadedCancelRef) {
          this.derefImagesLoaded();
        }
        this.masonry.destroy();
    }
    /** ****************************************************************
     *
     * **************************************************************** */
    initializeMasonry (force) {
        if (!this.masonry || force) {
            this.masonry = new Masonry(
                this.masonryContainer,
                this.props.options
            );

            if (this.props.onLayoutComplete) {
                this.masonry.on('layoutComplete', this.props.onLayoutComplete);
            }

            if (this.props.onRemoveComplete) {
                this.masonry.on('removeComplete', this.props.onRemoveComplete);
            }

            this.latestKnownDomChildren = this.getCurrentDomChildren();
        }
    }
    /** ****************************************************************
     *
     * **************************************************************** */
    getCurrentDomChildren () {
        var node = this.masonryContainer;
        var children = this.props.options.itemSelector
            ? node.querySelectorAll(this.props.options.itemSelector)
            : node.children;

        return Array.prototype.slice.call(children);
    }
    /** ****************************************************************
     *
     * **************************************************************** */
    initializeResizableChildren () {
        if (!this.props.enableResizableChildren) {
            return;
        }

        this.erd = elementResizeDetectorMaker({
            strategy: 'scroll'
        });

        this.latestKnownDomChildren.forEach(this.listenToElementResize, this);
    }
    /** ****************************************************************
     *
     * **************************************************************** */
    derefImagesLoaded () {
        this.imagesLoadedCancelRef();
        this.imagesLoadedCancelRef = undefined;
    }
    /** ****************************************************************
     *
     * **************************************************************** */
    imagesLoaded () {
        if (this.props.disableImagesLoaded) {
            return;
        }

        if (this.imagesLoadedCancelRef) {
            this.derefImagesLoaded();
        }

        var event = this.props.updateOnEachImageLoad ? 'progress' : 'always';

        var handler = debounce(
            function(instance) {
                if (this.props.onImagesLoaded) {
                    this.props.onImagesLoaded(instance);
                }
                this.masonry.layout();
            }.bind(this), 100);

        var imgLoad = imagesloaded(this.masonryContainer, this.props.imagesLoadedOptions).on(event, handler);

        this.imagesLoadedCancelRef = function() {
            imgLoad.off(event, handler);
            handler.cancel();
        };
    }
    /** ****************************************************************
     *
     * **************************************************************** */
    diffDomChildren () {
        var forceItemReload = false;

        var knownChildrenStillAttached = this.latestKnownDomChildren.filter(function(element) {
            /*
             * take only elements attached to DOM
             * (aka the parent is the masonry container, not null)
             * otherwise masonry would try to "remove it" again from the DOM
             */
            return !!element.parentNode;
        });

        /*
         * If not all known children are attached to the dom - we have no other way of notifying
         * masonry to remove the ones not still attached besides invoking a complete item reload.
         * basically all the rest of the code below does not matter in that case.
         */
        if (knownChildrenStillAttached.length !== this.latestKnownDomChildren.length) {
            forceItemReload = true;
        }

        var currentDomChildren = this.getCurrentDomChildren();

        /*
         * Since we are looking for a known child which is also attached to the dom AND
         * not attached to the dom at the same time - this would *always* produce an empty array.
         */
        var removed = knownChildrenStillAttached.filter(function(attachedKnownChild) {
            return !~currentDomChildren.indexOf(attachedKnownChild);
        });

        /*
         * This would get any children which are attached to the dom but are *unkown* to us
         * from previous renders
         */
        var newDomChildren = currentDomChildren.filter(function(currentChild) {
            return !~knownChildrenStillAttached.indexOf(currentChild);
        });

        var beginningIndex = 0;

        // get everything added to the beginning of the DOMNode list
        var prepended = newDomChildren.filter(function(newChild) {
            var prepend = (beginningIndex === currentDomChildren.indexOf(newChild));

            if (prepend) {
                // increase the index
                beginningIndex++;
            }

            return prepend;
        });

        // we assume that everything else is appended
        var appended = newDomChildren.filter(function(el) {
            return prepended.indexOf(el) === -1;
        });

        /*
         * otherwise we reverse it because so we're going through the list picking off the items that
         * have been added at the end of the list. this complex logic is preserved in case it needs to be
         * invoked
         *
         * var endingIndex = currentDomChildren.length - 1;
         *
         * newDomChildren.reverse().filter(function(newChild, i){
         *     var append = endingIndex == currentDomChildren.indexOf(newChild);
         *
         *     if (append) {
         *         endingIndex--;
         *     }
         *
         *     return append;
         * });
         */

        // get everything added to the end of the DOMNode list
        var moved = [];

        /*
         * This would always be true (see above about the lofic for "removed")
         */
        if (removed.length === 0) {
            /*
             * 'moved' will contain some random elements (if any) since the "knownChildrenStillAttached" is a filter
             * of the "known" children which are still attached - All indexes could basically change. (for example
             * if the first element is not attached)
             * Don't trust this array.
             */
            moved = knownChildrenStillAttached.filter(function(child, index) {
                return index !== currentDomChildren.indexOf(child);
            });
        }

        this.latestKnownDomChildren = currentDomChildren;

        return {
            old: knownChildrenStillAttached, // Not used
            new: currentDomChildren, // Not used
            removed: removed,
            appended: appended,
            prepended: prepended,
            moved: moved,
            forceItemReload: forceItemReload
        };
    }
    performLayout () {
        const diff = this.diffDomChildren();
        const reloadItems = diff.forceItemReload || diff.moved.length > 0;

        // Would never be true. (see comments of 'diffDomChildren' about 'removed')
        if (diff.removed.length > 0) {
            if (this.props.enableResizableChildren) {
                diff.removed.forEach(this.erd.removeAllListeners, this.erd);
            }
            this.masonry.remove(diff.removed);
            reloadItems = true;
        }

        if (diff.appended.length > 0) {
            this.masonry.appended(diff.appended);

            if (diff.prepended.length === 0) {
                reloadItems = true;
            }

            if (this.props.enableResizableChildren) {
                diff.appended.forEach(this.listenToElementResize, this);
            }
        }

        if (diff.prepended.length > 0) {
            this.masonry.prepended(diff.prepended);

            if (this.props.enableResizableChildren) {
                diff.prepended.forEach(this.listenToElementResize, this);
            }
        }

        if (reloadItems) {
            this.masonry.reloadItems();
        }

        this.masonry.layout();
    }
    destroyErd () {
        if (this.erd) {
            this.latestKnownDomChildren.forEach(this.erd.uninstall, this.erd);
        }
    }
    listenToElementResize (el) {
        this.erd.listenTo(el, function() {
            this.masonry.layout();
        }.bind(this));
    }
    // どこからも呼ばれていない。 createReactClass かな?
    getDefaultProps () {
        return {
            enableResizableChildren: false,
            disableImagesLoaded: false,
            updateOnEachImageLoad: false,
            options: {},
            imagesLoadedOptions: {},
            className: '',
            elementType: 'div',
            onLayoutComplete: function() {
            },
            onRemoveComplete: function() {
            }
        };
    }
}
