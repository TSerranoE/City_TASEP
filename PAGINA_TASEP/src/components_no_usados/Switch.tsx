import React from "react";
import TripleToggleSwitch from ".TripleToggleSwitch"; // Asegúrate de que esta ruta sea correcta

const Switch: React.FC = () => {
  const labels = {
    left: {
      title: "Paralelo",
      value: "Paralelo",
    },
    right: {
      title: "Continuo",
      value: "Continuo",
    },
    center: {
      title: "Secuencial",
      value: "Secuencial",
    },
  };
  type ValueType = string | number | boolean;

  const onChange = (value: ValueType) => console.log("value", value);

  return <TripleToggleSwitch labels={labels} onChange={onChange} />;
};

export default Switch;
