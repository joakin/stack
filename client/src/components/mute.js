import React from "react";
import Toggle from "material-ui/Toggle";

export default ({ muted, onChange }) => {
  let toggle = (e, toggled) => onChange();
  return (
    <div className="Mute">
      <Toggle
        name="mute_checkbox"
        defaultToggled={!muted}
        label="Sound"
        onToggle={toggle}
      />
    </div>
  );
};
