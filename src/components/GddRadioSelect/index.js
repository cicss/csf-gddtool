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

import '../../styles/GddRadioSelect.css';

@inject("store") @observer
class GddRadioSelect extends Component {

  render() {
        return (
            <div className='radio-input-div'>
            <div className='radio-input-label'>
                <label><b>GDD Threshold</b></label>
            </div>
            <div className='radio-div'>
                <form>
                  <div className="radio">
                    <label>
                      <input type="radio" value="gdd50" 
                          checked={this.props.store.app.getGddType === 'gdd50'} 
                          onChange={this.props.store.app.updateGddType} />
                      Base 50
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" value="gdd8650" 
                          checked={this.props.store.app.getGddType === 'gdd8650'} 
                          onChange={this.props.store.app.updateGddType} />
                      Base 8650
                    </label>
                  </div>
                </form>
            </div>
            </div>
        )
  }

};

export default GddRadioSelect;
