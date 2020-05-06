import React, {Component} from "react";
import PropTypes from "prop-types";
import "./InfoCard.scss";

class InfoCard extends Component {
  constructor(props, context) {
    super(props, context);

    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const {children} = this.props;

    if (children !== undefined) {
      return children;
    } else {
      return <br></br>;
    }
  }

  render() {
    const {title, subtitle, className} = this.props;

    return (
      <div className={"p-badge " + className}>
        <div className="p-badge-body">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}

InfoCard.defaultProps = {
  className: "pt-4 pb-2 text-center",
  children: undefined,
};

InfoCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

export default InfoCard;
