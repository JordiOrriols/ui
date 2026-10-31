import { useState } from "react";
import { PublicAppShell } from "./PublicAppShell";
import { ErrorState } from "./ErrorState";
import { Button } from "../ui/button";

export default {
  title: "Views/PublicAppShell",
  component: PublicAppShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

function LinkExample({ longContent = false }: { longContent?: boolean }) {
  const [language, setLanguage] = useState("en");
  const [saved, setSaved] = useState(false);
  return (
    <PublicAppShell
      projectId="planner"
      mainClassName="max-w-none"
      header={{
        title: "Shared vacation schedule",
        subtitle: "Only actions permitted by the link are available.",
        language: { value: language, label: "Language", onValueChange: setLanguage },
      }}
    >
      <p>{saved ? "Permitted changes saved." : "Token-scoped content."}</p>
      <Button onClick={() => setSaved(true)}>Save permitted changes</Button>
      {longContent &&
        Array.from({ length: 40 }, (_, index) => (
          <p className="py-3" key={index}>
            Member {index + 1}
          </p>
        ))}
    </PublicAppShell>
  );
}

export const RestrictedEditing = { render: () => <LinkExample /> };
export const LongContent = { render: () => <LinkExample longContent /> };
export const Unavailable = {
  render: () => (
    <PublicAppShell projectId="shiplog" header={{ title: "Shared releases" }}>
      <ErrorState message="This link is unavailable." />
    </PublicAppShell>
  ),
};
