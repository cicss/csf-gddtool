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
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import { withBaseIcon } from 'react-icons-kit';
import { calendar } from 'react-icons-kit/fa/calendar';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/PlantingDatePicker.css';

class DatePickerButton extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        value: PropTypes.string
    };
    render() {
        const {value, onClick} = this.props;
        //const IconGreen14 = withBaseIcon({ size: 14, style: {color:'#4ca20b'}});
        const IconGreen14 = withBaseIcon({ size: 14, style: {color:'#006600'}});

        return (
            <div className="date-picker-button-group">
                <button
                  className="date-picker-button"
                  onClick={onClick}>
                  {value}
                  <IconGreen14 icon={calendar} className="cal-icon" onClick={onClick} />
                </button>
            </div>
        );
    }
}

@inject("store") @observer
class PlantingDatePicker extends Component {

  isMonthInGrowingSeason = (d) => {
    let month = moment(d).month() + 1
    let validMonths = [1,2,3,4,5,6,7,8,9,10]
    return validMonths.includes(month)
  }

  getMaxDate = () => {
    let thisYear = moment().year()
    if (this.props.store.app.latestSelectableYear === thisYear) {
        return moment()
    } else {
        return moment(this.props.store.app.latestSelectableYear.toString()+"-10-31")
    }
  }

  render() {
        return (
            <div className='planting-datepicker-input-div'>
            <div className='planting-datepicker-input-label'>
              <label><b>Planting Date:</b></label>
            </div>
            <div className='planting-datepicker-div'>
              <DatePicker
                  customInput={<DatePickerButton />}
                  className='input-date'
                  calendarClassName='calendar-pdate'
                  readOnly={true}
                  fixedHeight={true}
                  //selected={moment(this.props.store.app.getPlantingDate,"MM-DD-YYYY")}
                  selected={this.props.store.app.getPlantingDate}
                  onChange={this.props.store.app.updatePlantingDate}
                  minDate={moment("2016-01-01")}
                  //maxDate={moment(this.props.store.app.latestSelectableYear.toString()+"-10-31")}
                  //maxDate={moment()}
                  maxDate={this.getMaxDate()}
                  showMonthDropdown
                  showYearDropdown
                  scrollableMonthDropdown
                  scrollableYearDropdown
                  dropdownMode="select"
                  filterDate={this.isMonthInGrowingSeason}
                  popperPlacement="right"
                  popperModifiers={{
                    offset: {
                      enabled: true,
                      offset: '40px, 15px'
                    },
                  }}
                  placeholderText="NONE"
              >
              </DatePicker>
            </div>
            </div>
        )
  }

};

export default PlantingDatePicker;
