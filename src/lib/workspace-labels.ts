export interface WorkspaceLabels {
  lifecycle?: WorkspaceLifecycleLabels;
  workspace: string;
  newWorkspace: string;
  share: string;
  access: { owner: string; editor: string; viewer: string; member: string };
  create: { title: string; description: string; name: string; cancel: string; submit: string };
  shareDialog: {
    people: string;
    emailsTab: string;
    linkTab: string;
    readOnlyDescription: string;
    publicLink: {
      title: string;
      link: string;
      copy: string;
      copied: string;
      open: string;
      enable: string;
      revoke: string;
      revokeDescription: string;
      disabled: string;
      unavailable: string;
      retry: string;
    };
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
  access: { owner: "Owner", editor: "Editor", viewer: "Viewer", member: "Member" },
  create: {
    title: "New workspace",
    description: "A workspace holds your teams and everything planned for them.",
    name: "Name",
    cancel: "Cancel",
    submit: "Create",
  },
  shareDialog: {
    people: "People with access",
    emailsTab: "Emails",
    linkTab: "Link",
    readOnlyDescription: "View who can access this workspace. Only the owner can change sharing.",
    publicLink: {
      title: "Public link",
      link: "Public link",
      copy: "Copy link",
      copied: "Link copied",
      open: "Open link",
      enable: "Enable public link",
      revoke: "Revoke public link",
      revokeDescription: "Disable this public link? Anyone with the old link will lose access.",
      disabled: "Public access is disabled. Only the workspace owner can enable it.",
      unavailable: "The public link is unavailable.",
      retry: "Retry",
    },
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
  access: { owner: "Propietario", editor: "Editor", viewer: "Lector", member: "Miembro" },
  create: {
    title: "Nuevo espacio de trabajo",
    description: "Un espacio de trabajo agrupa tus equipos y todo lo que planificas para ellos.",
    name: "Nombre",
    cancel: "Cancelar",
    submit: "Crear",
  },
  shareDialog: {
    people: "Personas con acceso",
    emailsTab: "Correos",
    linkTab: "Enlace",
    readOnlyDescription:
      "Consulta quién tiene acceso. Solo el propietario puede cambiar los permisos.",
    publicLink: {
      title: "Enlace público",
      link: "Enlace público",
      copy: "Copiar enlace",
      copied: "Enlace copiado",
      open: "Abrir enlace",
      enable: "Activar enlace público",
      revoke: "Revocar enlace público",
      revokeDescription:
        "¿Desactivar este enlace público? Quien tenga el enlace anterior perderá el acceso.",
      disabled: "El acceso público está desactivado. Solo el propietario puede activarlo.",
      unavailable: "El enlace público no está disponible.",
      retry: "Reintentar",
    },
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
  access: { owner: "Propietari", editor: "Editor", viewer: "Lector", member: "Membre" },
  create: {
    title: "Nou espai de treball",
    description: "Un espai de treball agrupa els teus equips i tot el que planifiques per a ells.",
    name: "Nom",
    cancel: "Cancel·lar",
    submit: "Crear",
  },
  shareDialog: {
    people: "Persones amb accés",
    emailsTab: "Correus",
    linkTab: "Enllaç",
    readOnlyDescription: "Consulta qui hi té accés. Només el propietari pot canviar els permisos.",
    publicLink: {
      title: "Enllaç públic",
      link: "Enllaç públic",
      copy: "Copiar enllaç",
      copied: "Enllaç copiat",
      open: "Obrir enllaç",
      enable: "Activar enllaç públic",
      revoke: "Revocar enllaç públic",
      revokeDescription:
        "Vols desactivar aquest enllaç públic? Qui tingui l'enllaç anterior perdrà l'accés.",
      disabled: "L'accés públic està desactivat. Només el propietari el pot activar.",
      unavailable: "L'enllaç públic no està disponible.",
      retry: "Tornar-ho a provar",
    },
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
  access: { owner: "Propriétaire", editor: "Éditeur", viewer: "Lecteur", member: "Membre" },
  create: {
    title: "Nouvel espace de travail",
    description:
      "Un espace de travail regroupe vos équipes et tout ce que vous planifiez pour elles.",
    name: "Nom",
    cancel: "Annuler",
    submit: "Créer",
  },
  shareDialog: {
    people: "Personnes ayant accès",
    emailsTab: "E-mails",
    linkTab: "Lien",
    readOnlyDescription: "Consultez les accès. Seul le propriétaire peut modifier le partage.",
    publicLink: {
      title: "Lien public",
      link: "Lien public",
      copy: "Copier le lien",
      copied: "Lien copié",
      open: "Ouvrir le lien",
      enable: "Activer le lien public",
      revoke: "Révoquer le lien public",
      revokeDescription:
        "Désactiver ce lien public ? Les personnes ayant l'ancien lien perdront l'accès.",
      disabled: "L'accès public est désactivé. Seul le propriétaire peut l'activer.",
      unavailable: "Le lien public est indisponible.",
      retry: "Réessayer",
    },
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
  access: { owner: "Eigentümer", editor: "Bearbeiter", viewer: "Betrachter", member: "Mitglied" },
  create: {
    title: "Neuer Arbeitsbereich",
    description: "Ein Arbeitsbereich enthält Ihre Teams und alles, was Sie für sie planen.",
    name: "Name",
    cancel: "Abbrechen",
    submit: "Erstellen",
  },
  shareDialog: {
    people: "Personen mit Zugriff",
    emailsTab: "E-Mails",
    linkTab: "Link",
    readOnlyDescription: "Sehen Sie, wer Zugriff hat. Nur der Eigentümer kann die Freigabe ändern.",
    publicLink: {
      title: "Öffentlicher Link",
      link: "Öffentlicher Link",
      copy: "Link kopieren",
      copied: "Link kopiert",
      open: "Link öffnen",
      enable: "Öffentlichen Link aktivieren",
      revoke: "Öffentlichen Link widerrufen",
      revokeDescription:
        "Diesen öffentlichen Link deaktivieren? Personen mit dem alten Link verlieren den Zugriff.",
      disabled: "Der öffentliche Zugriff ist deaktiviert. Nur der Eigentümer kann ihn aktivieren.",
      unavailable: "Der öffentliche Link ist nicht verfügbar.",
      retry: "Erneut versuchen",
    },
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
  access: { owner: "Proprietario", editor: "Editor", viewer: "Lettore", member: "Membro" },
  create: {
    title: "Nuovo spazio di lavoro",
    description: "Uno spazio di lavoro raccoglie i tuoi team e tutto ciò che pianifichi per loro.",
    name: "Nome",
    cancel: "Annulla",
    submit: "Crea",
  },
  shareDialog: {
    people: "Persone con accesso",
    emailsTab: "E-mail",
    linkTab: "Link",
    readOnlyDescription:
      "Visualizza chi ha accesso. Solo il proprietario può modificare la condivisione.",
    publicLink: {
      title: "Link pubblico",
      link: "Link pubblico",
      copy: "Copia link",
      copied: "Link copiato",
      open: "Apri link",
      enable: "Attiva link pubblico",
      revoke: "Revoca link pubblico",
      revokeDescription:
        "Disattivare questo link pubblico? Chi ha il vecchio link perderà l'accesso.",
      disabled: "L'accesso pubblico è disattivato. Solo il proprietario può attivarlo.",
      unavailable: "Il link pubblico non è disponibile.",
      retry: "Riprova",
    },
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

const BASE_LABELS: Record<string, WorkspaceLabels> = { en, es, ca, fr, de, it };

/** Built-in workspace copy in every app language, falling back to English. */
export function getWorkspaceLabels(language: string): WorkspaceLabels {
  return LABELS[language.split("-")[0] ?? "en"] ?? LABELS.en!;
}

export interface WorkspaceLifecycleLabels {
  title: string;
  description: string;
  wait: string;
  waiting: string;
  waitingDescription: string;
  refresh: string;
  signOut: string;
  delete: string;
  deleteTitle: string;
  deleteDescription: string;
}

const LIFECYCLE: Record<string, WorkspaceLifecycleLabels> = {
  en: {
    title: "How would you like to start?",
    description:
      "Create a workspace for your team, or wait for someone to invite you. Your account does not need its own workspace.",
    wait: "Wait for an invitation",
    waiting: "Waiting for an invitation",
    waitingDescription:
      "Ask a workspace owner to share access with your account. We will check for invitations automatically.",
    refresh: "Check invitations",
    signOut: "Sign out",
    delete: "Delete workspace",
    deleteTitle: "Delete this workspace?",
    deleteDescription:
      "Only empty workspaces can be deleted. Empty teams and projects will also be removed. Content in any app prevents deletion.",
  },
  es: {
    title: "¿Cómo quieres empezar?",
    description:
      "Crea un espacio para tu equipo o espera a que te inviten. Tu cuenta no necesita un espacio propio.",
    wait: "Esperar una invitación",
    waiting: "Esperando una invitación",
    waitingDescription:
      "Pide a un propietario que comparta el acceso con tu cuenta. Comprobaremos las invitaciones automáticamente.",
    refresh: "Comprobar invitaciones",
    signOut: "Cerrar sesión",
    delete: "Borrar espacio de trabajo",
    deleteTitle: "¿Borrar este espacio de trabajo?",
    deleteDescription:
      "Solo se pueden borrar espacios vacíos. También se eliminarán los equipos y proyectos vacíos. El contenido de cualquier aplicación impide borrarlo.",
  },
  ca: {
    title: "Com vols començar?",
    description:
      "Crea un espai per al teu equip o espera que et convidin. El teu compte no necessita un espai propi.",
    wait: "Esperar una invitació",
    waiting: "Esperant una invitació",
    waitingDescription:
      "Demana a un propietari que comparteixi l'accés amb el teu compte. Comprovarem les invitacions automàticament.",
    refresh: "Comprovar invitacions",
    signOut: "Tancar la sessió",
    delete: "Suprimir espai de treball",
    deleteTitle: "Vols suprimir aquest espai de treball?",
    deleteDescription:
      "Només es poden suprimir espais buits. També s'eliminaran els equips i projectes buits. El contingut de qualsevol aplicació impedeix suprimir-lo.",
  },
  fr: {
    title: "Comment souhaitez-vous commencer ?",
    description:
      "Créez un espace pour votre équipe ou attendez une invitation. Votre compte n'a pas besoin de son propre espace.",
    wait: "Attendre une invitation",
    waiting: "En attente d'une invitation",
    waitingDescription:
      "Demandez à un propriétaire de partager l'accès avec votre compte. Nous vérifierons automatiquement les invitations.",
    refresh: "Vérifier les invitations",
    signOut: "Se déconnecter",
    delete: "Supprimer l'espace",
    deleteTitle: "Supprimer cet espace ?",
    deleteDescription:
      "Seuls les espaces vides peuvent être supprimés, y compris leurs équipes et projets vides. Le contenu de toute application empêche la suppression.",
  },
  de: {
    title: "Wie möchten Sie beginnen?",
    description:
      "Erstellen Sie einen Arbeitsbereich oder warten Sie auf eine Einladung. Ihr Konto benötigt keinen eigenen Arbeitsbereich.",
    wait: "Auf eine Einladung warten",
    waiting: "Warten auf eine Einladung",
    waitingDescription:
      "Bitten Sie einen Eigentümer, den Zugriff mit Ihrem Konto zu teilen. Wir prüfen automatisch auf Einladungen.",
    refresh: "Einladungen prüfen",
    signOut: "Abmelden",
    delete: "Arbeitsbereich löschen",
    deleteTitle: "Diesen Arbeitsbereich löschen?",
    deleteDescription:
      "Nur leere Arbeitsbereiche können gelöscht werden, einschließlich leerer Teams und Projekte. Inhalte in einer Anwendung verhindern das Löschen.",
  },
  it: {
    title: "Come vuoi iniziare?",
    description:
      "Crea uno spazio per il tuo team o aspetta un invito. Il tuo account non ha bisogno di uno spazio proprio.",
    wait: "Aspettare un invito",
    waiting: "In attesa di un invito",
    waitingDescription:
      "Chiedi a un proprietario di condividere l'accesso con il tuo account. Controlleremo automaticamente gli inviti.",
    refresh: "Controllare gli inviti",
    signOut: "Esci",
    delete: "Elimina spazio",
    deleteTitle: "Eliminare questo spazio?",
    deleteDescription:
      "Si possono eliminare solo spazi vuoti, compresi team e progetti vuoti. Il contenuto di qualsiasi applicazione impedisce l'eliminazione.",
  },
};

export function getWorkspaceLifecycleLabels(language: string): WorkspaceLifecycleLabels {
  return LIFECYCLE[language.split("-")[0] ?? "en"] ?? LIFECYCLE.en!;
}

const LABELS: Record<string, WorkspaceLabels> = Object.fromEntries(
  Object.entries(BASE_LABELS).map(([language, labels]) => [
    language,
    { ...labels, lifecycle: getWorkspaceLifecycleLabels(language) },
  ])
);
