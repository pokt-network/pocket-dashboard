import React, { useCallback, useState } from "react";
import "styled-components/macro";
import {
  Button,
  Field,
  Link,
  TextInput,
  textStyle,
  useTheme,
  GU,
  RADIUS,
} from "ui";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const theme = useTheme();

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
      <h1
        css={`
          position: absolute;
          top: ${4 * GU}px;
          left: ${5 * GU}px;
          ${textStyle("title1")}
        `}
      >
        Pocket Dashboard
      </h1>
      <div
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
          Welcome back
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
            type="password"
          />
        </Field>
        <Field
          label="Repeat Password"
          required
          css={`
            margin-bottom: ${6 * GU}px;
          `}
        >
          <TextInput
            wide
            value={repeatedPassword}
            onChange={onRepeatedPasswordChange}
            type="password"
          />
        </Field>
        <Link
          css={`
            text-align: left;
            margin-bottom: ${6 * GU}px;
          `}
        >
          Forgot your password?
        </Link>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          Log in
        </Button>
        <p
          css={`
            text-align: center;
          `}
        >
          Don't have an account? <Link>Get started.</Link>
        </p>
      </div>
    </div>
  );
}
