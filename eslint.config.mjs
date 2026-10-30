import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Files already converted to the dictionary (lib/i18n/messages/en.ts + zh.ts). Hard-coded English
// UI text in them is a lint error, so new screens can't silently ship English-only. Add each
// file/folder here as its phase is converted; the goal is "app/**" and "components/**".
const I18N_ENFORCED = [
  "app/layout.tsx",
  "app/login/**",
  "app/(portal)/dashboard/page.tsx",
  "app/(portal)/settings/**",
  "app/(portal)/team/**",
  "app/(portal)/admin/users/**",
  "components/team/**",
  "components/sidebar.tsx",
  "components/sidebar-content.tsx",
  "components/topbar.tsx",
  "components/user-menu.tsx",
  "components/dashboard-link.tsx",
  "components/page-header.tsx",
  "components/placeholder-page.tsx",
  "components/login-form.tsx",
  "components/dashboard-access-grid.tsx",
  "components/ppc-top-up-chart.tsx",
  "components/core-values.tsx",
];

const LATIN = "/[A-Za-z]/";
const TEXT_ATTRS = "/^(placeholder|title|aria-label|alt|label)$/";
const message = "UI text must come from the i18n dictionary: use t(\"…\") and add the key to en.ts and zh.ts.";
// Rendered text: element children, or a text attribute (not className/href/key…).
const SHOWN = [":matches(JSXElement, JSXFragment) > JSXExpressionContainer", `JSXAttribute[name.name=${TEXT_ATTRS}] > JSXExpressionContainer`];
const shownStrings = SHOWN.flatMap((at) => [
  { selector: `${at} > Literal[value=${LATIN}]`, message },
  { selector: `${at} > ConditionalExpression > Literal[value=${LATIN}]`, message },
  { selector: `${at} > TemplateLiteral > TemplateElement[value.raw=${LATIN}]`, message },
]);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: I18N_ENFORCED,
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: `JSXText[value=${LATIN}]`, message },
        { selector: `JSXAttribute[name.name=${TEXT_ATTRS}] > Literal[value=${LATIN}]`, message },
        ...shownStrings,
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
