import React, { Component } from "react";
import "./Toggle.css";

type ValueType = string | number | boolean;

interface Label {
  title: string;
  value: ValueType;
}

interface Labels {
  left: Label;
  center: Label;
  right: Label;
}

interface Props {
  labels: Labels;
  onChange: (value: ValueType) => void;
  styles?: React.CSSProperties;
}

interface State {
  switchPosition: "left" | "center" | "right";
  animation: string | null;
}

class TripleToggleSwitch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      switchPosition: "left",
      animation: null,
    };
  }

  getSwitchAnimation = (value: ValueType) => {
    const { switchPosition } = this.state;
    let animation = null;
    if (value === "center" && switchPosition === "left") {
      animation = "left-to-center";
    } else if (value === "right" && switchPosition === "center") {
      animation = "center-to-right";
    } else if (value === "center" && switchPosition === "right") {
      animation = "right-to-center";
    } else if (value === "left" && switchPosition === "center") {
      animation = "center-to-left";
    } else if (value === "right" && switchPosition === "left") {
      animation = "left-to-right";
    } else if (value === "left" && switchPosition === "right") {
      animation = "right-to-left";
    }
    this.props.onChange(value);
    this.setState({
      switchPosition: value as "left" | "center" | "right",
      animation,
    });
  };

  render() {
    const { labels } = this.props;

    return (
      <div className="main-container">
        <div
          className={`switch ${this.state.animation} ${this.state.switchPosition}-position`}
        ></div>
        <input
          defaultChecked
          onChange={(e) => this.getSwitchAnimation(e.target.value as ValueType)}
          name="map-switch"
          id="left"
          type="radio"
          value="left"
        />
        <label
          className={`left-label ${
            this.state.switchPosition === "left" && "black-font"
          }`}
          htmlFor="left"
        >
          <h4>{labels.left.title}</h4>
        </label>

        <input
          onChange={(e) => this.getSwitchAnimation(e.target.value as ValueType)}
          name="map-switch"
          id="center"
          type="radio"
          value="center"
        />
        <label
          className={`center-label ${
            this.state.switchPosition === "center" && "black-font"
          }`}
          htmlFor="center"
        >
          <h4>{labels.center.title}</h4>
        </label>

        <input
          onChange={(e) => this.getSwitchAnimation(e.target.value as ValueType)}
          name="map-switch"
          id="right"
          type="radio"
          value="right"
        />
        <label
          className={`right-label ${
            this.state.switchPosition === "right" && "black-font"
          }`}
          htmlFor="right"
        >
          <h4>{labels.right.title}</h4>
        </label>
      </div>
    );
  }
}

export default TripleToggleSwitch;
