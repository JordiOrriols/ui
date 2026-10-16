export interface WorkspaceLabels {
  workspace: string;
  newWorkspace: string;
  share: string;
  access: { owner: string; editor: string; viewer: string };
  create: { title: string; description: string; name: string; cancel: string; submit: string };
  shareDialog: {
    title: (workspace: string) => string;
    description: string;
    email: string;
    app: string;
    allApps: string;
    permission: string;
    noAccess: string;
    submit: string;
    loading: string;
    empty: string;
    close: string;
    accessFor: (email: string, app: string) => string;
    remove: (email: string) => string;
  };
}

const en: WorkspaceLabels = {
  workspace: "Workspace",
  newWorkspace: "New workspace",
  share: "Share",
  access: { owner: "Owner", editor: "Editor", viewer: "Viewer" },
  create: {
    title: "New workspace",
    description: "A workspace holds your teams and everything planned for them.",
    name: "Name",
    cancel: "Cancel",
    submit: "Create",
  },
  shareDialog: {
    title: (workspace) => `Share ${workspace}`,
    description:
      "Choose which apps each person can open in this workspace and whether they can edit.",
    email: "Email",
    app: "App",
    allApps: "All apps",
    permission: "Permission",
    noAccess: "No access",
    submit: "Share",
    loading: "Loading…",
    empty: "Not shared with anyone yet.",
    close: "Close",
    accessFor: (email, app) => `${app} access for ${email}`,
    remove: (email) => `Remove ${email}`,
  },
};

const es: WorkspaceLabels = {
  workspace: "Espacio de trabajo",
  newWorkspace: "Nuevo espacio de trabajo",
  share: "Compartir",
  access: { owner: "Propietario", editor: "Editor", viewer: "Lector" },
  create: {
    title: "Nuevo espacio de trabajo",
    description: "Un espacio de trabajo agrupa tus equipos y todo lo que planificas para ellos.",
    name: "Nombre",
    cancel: "Cancelar",
    submit: "Crear",
  },
  shareDialog: {
    title: (workspace) => `Compartir ${workspace}`,
    description:
      "Elige qué aplicaciones puede abrir cada persona en este espacio de trabajo y si puede editar.",
    email: "Email",
    app: "Aplicación",
    allApps: "Todas las aplicaciones",
    permission: "Permiso",
    noAccess: "Sin acceso",
    submit: "Compartir",
    loading: "Cargando…",
    empty: "Todavía no se ha compartido con nadie.",
    close: "Cerrar",
    accessFor: (email, app) => `Acceso a ${app} para ${email}`,
    remove: (email) => `Quitar ${email}`,
  },
};

const ca: WorkspaceLabels = {
  workspace: "Espai de treball",
  newWorkspace: "Nou espai de treball",
  share: "Compartir",
  access: { owner: "Propietari", editor: "Editor", viewer: "Lector" },
  create: {
    title: "Nou espai de treball",
    description: "Un espai de treball agrupa els teus equips i tot el que planifiques per a ells.",
    name: "Nom",
    cancel: "Cancel·lar",
    submit: "Crear",
  },
  shareDialog: {
    title: (workspace) => `Compartir ${workspace}`,
    description:
      "Tria quines aplicacions pot obrir cada persona en aquest espai de treball i si pot editar.",
    email: "Email",
    app: "Aplicació",
    allApps: "Totes les aplicacions",
    permission: "Permís",
    noAccess: "Sense accés",
    submit: "Compartir",
    loading: "Carregant…",
    empty: "Encara no s'ha compartit amb ningú.",
    close: "Tancar",
    accessFor: (email, app) => `Accés a ${app} per a ${email}`,
    remove: (email) => `Treure ${email}`,
  },
};

const fr: WorkspaceLabels = {
  workspace: "Espace de travail",
  newWorkspace: "Nouvel espace de travail",
  share: "Partager",
  access: { owner: "Propriétaire", editor: "Éditeur", viewer: "Lecteur" },
  create: {
    title: "Nouvel espace de travail",
    description:
      "Un espace de travail regroupe vos équipes et tout ce que vous planifiez pour elles.",
    name: "Nom",
    cancel: "Annuler",
    submit: "Créer",
  },
  shareDialog: {
    title: (workspace) => `Partager ${workspace}`,
    description:
      "Choisissez les applications que chaque personne peut ouvrir dans cet espace de travail et si elle peut modifier.",
    email: "E-mail",
    app: "Application",
    allApps: "Toutes les applications",
    permission: "Autorisation",
    noAccess: "Aucun accès",
    submit: "Partager",
    loading: "Chargement…",
    empty: "Pas encore partagé.",
    close: "Fermer",
    accessFor: (email, app) => `Accès à ${app} pour ${email}`,
    remove: (email) => `Retirer ${email}`,
  },
};

const de: WorkspaceLabels = {
  workspace: "Arbeitsbereich",
  newWorkspace: "Neuer Arbeitsbereich",
  share: "Teilen",
  access: { owner: "Eigentümer", editor: "Bearbeiter", viewer: "Betrachter" },
  create: {
    title: "Neuer Arbeitsbereich",
    description: "Ein Arbeitsbereich enthält Ihre Teams und alles, was Sie für sie planen.",
    name: "Name",
    cancel: "Abbrechen",
    submit: "Erstellen",
  },
  shareDialog: {
    title: (workspace) => `${workspace} teilen`,
    description:
      "Wählen Sie, welche Apps jede Person in diesem Arbeitsbereich öffnen kann und ob sie bearbeiten darf.",
    email: "E-Mail",
    app: "App",
    allApps: "Alle Apps",
    permission: "Berechtigung",
    noAccess: "Kein Zugriff",
    submit: "Teilen",
    loading: "Wird geladen…",
    empty: "Noch mit niemandem geteilt.",
    close: "Schließen",
    accessFor: (email, app) => `${app}-Zugriff für ${email}`,
    remove: (email) => `${email} entfernen`,
  },
};

const it: WorkspaceLabels = {
  workspace: "Spazio di lavoro",
  newWorkspace: "Nuovo spazio di lavoro",
  share: "Condividi",
  access: { owner: "Proprietario", editor: "Editor", viewer: "Lettore" },
  create: {
    title: "Nuovo spazio di lavoro",
    description: "Uno spazio di lavoro raccoglie i tuoi team e tutto ciò che pianifichi per loro.",
    name: "Nome",
    cancel: "Annulla",
    submit: "Crea",
  },
  shareDialog: {
    title: (workspace) => `Condividi ${workspace}`,
    description:
      "Scegli quali app ogni persona può aprire in questo spazio di lavoro e se può modificare.",
    email: "Email",
    app: "App",
    allApps: "Tutte le app",
    permission: "Permesso",
    noAccess: "Nessun accesso",
    submit: "Condividi",
    loading: "Caricamento…",
    empty: "Non ancora condiviso con nessuno.",
    close: "Chiudi",
    accessFor: (email, app) => `Accesso a ${app} per ${email}`,
    remove: (email) => `Rimuovi ${email}`,
  },
};

const LABELS: Record<string, WorkspaceLabels> = { en, es, ca, fr, de, it };

/** Built-in workspace copy in every app language, falling back to English. */
export function getWorkspaceLabels(language: string): WorkspaceLabels {
  return LABELS[language.split("-")[0] ?? "en"] ?? en;
}
