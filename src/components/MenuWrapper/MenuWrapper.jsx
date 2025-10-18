import React, { Component } from "react";
import ResponsiveView from "../ResponsiveView/ResponsiveView.jsx";
class Menu extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.state.resized === true) {
      this.props.setState({ resized: false });
      return true;
    }

    if (this.props.state.upDateCp !== nextProps.state.upDateCp) {
      return true;
    }
    if (this.props.state.solvedSet !== nextProps.state.solvedSet) {
      return true;
    }

    if (this.props.state.currentFunc === "Scrambling") return true;

    if (this.props.state.activeMenu === nextProps.state.activeMenu && this.props.state.activeMenu === "none") return false;

    if (
      (this.props.state.currentFunc === "Algorithms" || this.props.state.currentFunc === "Solving") &&
      this.props.state.moveSet === nextProps.state.moveSet &&
      this.props.state.playOne === false &&
      this.props.state.autoPlay === false &&
      this.props.state.autoRewind === false &&
      nextProps.state.autoRewind === false
    )
      return false;
    return true;
  }
  render() {
    const props = this.props;
    return <ResponsiveView {...props} />;
  }
}

export default React.memo(Menu);
