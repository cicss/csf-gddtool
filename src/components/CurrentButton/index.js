///////////////////////////////////////////////////////////////////////////////
//
// Climate Smart Farming Growing Degree Day Calculator
// Copyright (c) 2018 Cornell Institute for Climate Smart Solutions
// All Rights Reserved
//
// This software is published under the provisions of the GNU General Public
// License <http://www.gnu.org/licenses/>. A text copy of the license can be
// found in the file 'LICENSE' included with this software.
//
// A text copy of the copyright notice, licensing conditions and disclaimers
// is available in the file 'COPYRIGHT' included with this software.
//
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { string } from 'prop-types'
import Icon from 'react-icons-kit';
import { line_graph } from 'react-icons-kit/ikons/line_graph';       

import '../../styles/CurrentButton.css';

@inject("store") @observer
class CurrentButton extends Component {

  static propTypes = {
    button_label: string,
  }

  static defaultProps = {
    button_label: "Go",
  }

  render() {
        const className = this.props.store.app.currentStatus ? 'current-button-active' : 'current-button-inactive';
        return (
            <div className="current-label">
              <div>
                <button
                  className={className}
                  onClick={() => {
                      this.props.store.app.updateCurrentStatus(true);
                      this.props.store.app.updateTrendStatus(false);
                      this.props.store.app.updateClimateChangeStatus(false);
                      this.props.store.app.updateSeasonStatus(false);
                      if (this.props.store.app.popupStatus) { this.props.store.app.updatePopupStatus(); }
                      }
                  }
                >
                  <Icon size={14} icon={line_graph} className="current-graph-icon" />
                  {this.props.button_label}
                </button>
              </div>
            </div>
        )
  }

};

export default CurrentButton;
