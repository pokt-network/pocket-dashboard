import React, { useCallback, useState } from "react";
import "styled-components/macro";
import { useViewport } from "use-viewport";
import {
  Button,
  Field,
  CheckBox,
  Link,
  TextInput,
  textStyle,
  useTheme,
  GU,
  RADIUS,
} from "ui";
import OnboardingHeader from "components/OnboardingHeader/OnboardingHeader";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const theme = useTheme();
  const { within } = useViewport();

  const compactMode = within(-1, "medium");

  const onCheckChange = useCallback((e) => setChecked(e), []);
  const onUsernameChange = useCallback((e) => setUsername(e.target.value), []);
  const onPasswordChange = useCallback((e) => setPassword(e.target.value), []);
  const onRepeatedPasswordChange = useCallback(
    (e) => setRepeatedPassword(e.target.value),
    []
  );

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
          Get started
        </h2>
        <Field
          label="Username"
          required
          css={`
            margin-bottom: ${5 * GU}px;
          `}
        >
          <TextInput wide value={username} onChange={onUsernameChange} />
        </Field>
        <Field label="Password" required>
          <TextInput
            wide
            value={password}
            onChange={onPasswordChange}
            type="password"
          />
        </Field>
        <Field label="Repeat Password" required>
          <TextInput
            wide
            value={repeatedPassword}
            onChange={onRepeatedPasswordChange}
            type="password"
          />
        </Field>
        <label
          css={`
            margin-bottom: ${6 * GU}px;
            ${textStyle("body2")}
            word-break: ${compactMode ? "break-word" : "break-all"};
          `}
        >
          <CheckBox
            checked={checked}
            onChange={onCheckChange}
            aria-label="I agree to the pocket Dashboard terms and conditions"
            css={`
              display: inline-block;
            `}
          />
          <span
            css={`
              padding-top: 5px;
              vertical-align: bottom;
              margin-left: ${1 * GU}px;
            `}
          >
            I Agree to the Pocket Dashboard's{" "}
            <Link
              href="#"
              css={`
                display: inline;
              `}
            >
              T. &amp; C. and Privacy Policy
            </Link>
          </span>
        </label>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          Sign up
        </Button>
      </main>
    </div>
  );
}
