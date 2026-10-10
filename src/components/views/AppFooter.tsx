export function AppFooter({ text = "Made with love by Jordi Orriols" }: { text?: string }) {
  return (
    <footer
      className="border-t border-border bg-background px-4 py-6 text-center text-xs text-muted-foreground"
      data-testid="app-footer"
    >
      {text}
    </footer>
  );
}
