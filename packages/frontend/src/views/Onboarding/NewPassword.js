import React, { useCallback, useState } from "react";
import "styled-components/macro";
import { Button, Field, TextInput, textStyle, useTheme, GU, RADIUS } from "ui";
import OnboardingHeader from "components/OnboardingHeader/OnboardingHeader";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const theme = useTheme();

  const onPasswordChange = useCallback((e) => setPassword(e.target.value), []);

  return (
    <div
      css={`
        width: 100%;
        min-height: 100vh;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: ${theme.background};
      `}
    >
      <OnboardingHeader />
      <main
        css={`
          width: 100%;
          height: auto;
          max-width: ${120 * GU}px;
          border-radius: ${RADIUS}px;
          padding: ${5 * GU}px ${8 * GU}px;
          border: 1px solid ${theme.border};
          background: ${theme.surface};
          display: flex;
          flex-direction: column;
        `}
      >
        <h2
          css={`
            ${textStyle("title2")}
            margin-bottom: ${6 * GU}px;
          `}
        >
          Set your new password
        </h2>
        <Field
          label="Password"
          required
          css={`
            margin-bottom: ${6 * GU}px;
          `}
        >
          <TextInput
            wide
            value={password}
            onChange={onPasswordChange}
            type="email"
          />
        </Field>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          Set new password
        </Button>
      </main>
    </div>
  );
}
