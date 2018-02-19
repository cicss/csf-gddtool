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
import { any } from 'prop-types'

import '../../styles/DisplayClimateChange.css';

@inject("store") @observer
class DisplayClimateChange extends Component {

  static propTypes = {
    content: any,
  }

  static defaultProps = {
    content: <h2>Climate Change Projection Content</h2>,
  }

  render() {
        const className = this.props.store.app.climateChangeStatus ? 'climate-change-display-active' : 'climate-change-display-none';
        return (
            <div className={className}>
              <div className="climate-change-display-content">
                 {this.props.content}
              </div>
            </div>
        )
  }

};

export default DisplayClimateChange;
