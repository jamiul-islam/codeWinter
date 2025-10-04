import { toast } from 'sonner'

export const prdToast = {
  generateStarted: (featureTitle: string) => {
    toast.loading(`Generating PRD for ${featureTitle}...`, {
      id: `prd-generate-${featureTitle}`,
      description: 'This may take up to 3 minutes',
    })
  },

  generateSuccess: (featureTitle: string) => {
    toast.success(`PRD generated for ${featureTitle}`, {
      id: `prd-generate-${featureTitle}`,
      description: 'Your PRD is ready to view and download',
    })
  },

  generateError: (featureTitle: string, error: string) => {
    toast.error(`Failed to generate PRD for ${featureTitle}`, {
      id: `prd-generate-${featureTitle}`,
      description: error,
    })
  },

  regenerateStarted: (featureTitle: string) => {
    toast.loading(`Regenerating PRD for ${featureTitle}...`, {
      id: `prd-regenerate-${featureTitle}`,
      description: 'Creating a new version',
    })
  },

  regenerateSuccess: (featureTitle: string) => {
    toast.success(`PRD regenerated for ${featureTitle}`, {
      id: `prd-regenerate-${featureTitle}`,
      description: 'Your updated PRD is ready',
    })
  },

  regenerateError: (featureTitle: string, error: string) => {
    toast.error(`Failed to regenerate PRD for ${featureTitle}`, {
      id: `prd-regenerate-${featureTitle}`,
      description: error,
    })
  },

  downloadStarted: (featureTitle: string) => {
    toast.loading(`Downloading PRD for ${featureTitle}...`, {
      id: `prd-download-${featureTitle}`,
    })
  },

  downloadSuccess: (featureTitle: string) => {
    toast.success(`PRD downloaded for ${featureTitle}`, {
      id: `prd-download-${featureTitle}`,
      description: 'Check your downloads folder',
    })
  },

  downloadError: (featureTitle: string) => {
    toast.error(`Failed to download PRD for ${featureTitle}`, {
      id: `prd-download-${featureTitle}`,
      description: 'Please try again',
    })
  },

  prdUpdated: (featureTitle: string) => {
    toast.success(`PRD updated for ${featureTitle}`, {
      id: `prd-update-${featureTitle}`,
      description: 'Your changes have been saved',
    })
  },

  prdUpdateError: (featureTitle: string) => {
    toast.error(`Failed to update PRD for ${featureTitle}`, {
      id: `prd-update-${featureTitle}`,
      description: 'Please try again',
    })
  },

  apiKeyMissing: () => {
    toast.error('Gemini API key required', {
      description: 'Add your API key in settings to use AI-assisted features.',
      action: {
        label: 'Go to Settings',
        onClick: () => (window.location.href = '/settings'),
      },
    })
  },
}

export const projectToast = {
  autofillStarted: () =>
    toast.loading('Generating feature ideas…', {
      id: 'project-autofill',
      description: 'Asking Gemini to suggest five launch-ready features.',
    }),

  autofillSuccess: (count: number) =>
    toast.success('Features added', {
      id: 'project-autofill',
      description: `${count} AI-generated features have been populated.`,
    }),

  autofillError: (message?: string) =>
    toast.error('Feature generation failed', {
      id: 'project-autofill',
      description: message ?? 'Please try again or adjust your project details.',
    }),
}