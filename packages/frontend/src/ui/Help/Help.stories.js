import React from "react";
import { Root } from "ui/Root/Root";
import Help from "ui/Help/Help";

export default {
  title: "pocketUI/Help",
  component: Help,
  argTypes: {
    children: { control: "text", defaultValue: "Log in" },
    hint: { control: "text", defaultValue: "Log in" },
  },
};

const Template = (args) => {
  return (
    <Root.Provider>
      <Help {...args} />
    </Root.Provider>
  );
};

export const Primary = Template.bind({});
