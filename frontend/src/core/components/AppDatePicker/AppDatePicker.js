import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import {faCalendarAlt} from "@fortawesome/free-solid-svg-icons";
import "./AppDatePicker.scss";
import {PropTypes} from "prop-types";

class AppDatePicker extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDateChange = this.handleDateChange.bind(this);

    this.state = {
      date: new Date(),
    };
  }

  handleDateChange(date, onChange) {
    this.setState({date: date});
    if (onChange) {
      onChange(date);
    }
  }

  render() {
    const {date} = this.state;

    const {onChange, ...props} = this.props;

    const DateButton = ({value, onClick}) => (
      <button className="wrapper-btn" onClick={onClick}>
        <span>{value}</span>
        <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
      </button>
    );

    return (
      <span className="date-picker">
        <DatePicker
          {...props}
          selected={date}
          onChange={(date) => this.handleDateChange(date, onChange)}
          className="form-control"
          customInput={<DateButton />}
        />
      </span>
    );
  }
}

AppDatePicker.propTypes = {
  onChange: PropTypes.func,
};

export default AppDatePicker;
