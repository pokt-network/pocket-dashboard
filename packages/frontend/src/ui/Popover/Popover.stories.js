import React from "react";
import "styled-components/macro";
import Button from "ui/Button/Button";
import Popover from "ui/Popover/Popover";
import { Root } from "ui/Root/Root";

export default {
  title: "pocketUI/Popover",
  component: Popover,
  argTypes: {
    visible: { control: "boolean", defaultValue: false },
  },
};

const Template = (args) => {
  const opener = React.createRef();

  React.useEffect(() => console.log(opener), [opener]);

  console.log(args);
  return (
    <Root.Provider>
      <div>
        <Button onClick={() => {}} ref={opener}>
          Show
        </Button>
        <Popover visible={args.visible} opener={opener.current} {...args}>
          Hey
        </Popover>
      </div>
    </Root.Provider>
  );
};

export const Primary = Template.bind({});
