/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import React, { Component } from "react";
import PropTypes from "prop-types";

import ColumnBreakpoint from "./ColumnBreakpoint";

import {
  getSelectedSource,
  visibleColumnBreakpoints,
  getContext,
  isSourceBlackBoxed,
} from "../../selectors";
import actions from "../../actions";
import { connect } from "../../utils/connect";
import { makeBreakpointId } from "../../utils/breakpoint";

// eslint-disable-next-line max-len

class ColumnBreakpoints extends Component {
  static get propTypes() {
    return {
      columnBreakpoints: PropTypes.array.isRequired,
      cx: PropTypes.object.isRequired,
      editor: PropTypes.object.isRequired,
      selectedSource: PropTypes.object,
    };
  }

  render() {
    const {
      cx,
      editor,
      columnBreakpoints,
      selectedSource,
      showEditorCreateBreakpointContextMenu,
      showEditorEditBreakpointContextMenu,
      toggleDisabledBreakpoint,
      removeBreakpoint,
      addBreakpoint,
    } = this.props;

    if (!selectedSource || columnBreakpoints.length === 0) {
      return null;
    }

    let breakpoints;
    editor.codeMirror.operation(() => {
      breakpoints = columnBreakpoints.map(breakpoint => (
        <ColumnBreakpoint
          cx={cx}
          key={makeBreakpointId(breakpoint.location)}
          columnBreakpoint={breakpoint}
          editor={editor}
          source={selectedSource}
          showEditorCreateBreakpointContextMenu={
            showEditorCreateBreakpointContextMenu
          }
          showEditorEditBreakpointContextMenu={
            showEditorEditBreakpointContextMenu
          }
          toggleDisabledBreakpoint={toggleDisabledBreakpoint}
          removeBreakpoint={removeBreakpoint}
          addBreakpoint={addBreakpoint}
        />
      ));
    });
    return <div>{breakpoints}</div>;
  }
}

const mapStateToProps = state => {
  // Avoid rendering this component is there is no selected source,
  // or if the selected source is blackboxed.
  // Also avoid computing visible column breakpoint when this happens.
  const selectedSource = getSelectedSource(state);
  if (!selectedSource || isSourceBlackBoxed(state, selectedSource)) {
    return {};
  }
  return {
    cx: getContext(state),
    selectedSource,
    columnBreakpoints: visibleColumnBreakpoints(state),
  };
};

export default connect(mapStateToProps, {
  showEditorCreateBreakpointContextMenu:
    actions.showEditorCreateBreakpointContextMenu,
  showEditorEditBreakpointContextMenu:
    actions.showEditorEditBreakpointContextMenu,
  toggleDisabledBreakpoint: actions.toggleDisabledBreakpoint,
  removeBreakpoint: actions.removeBreakpoint,
  addBreakpoint: actions.addBreakpoint,
})(ColumnBreakpoints);
