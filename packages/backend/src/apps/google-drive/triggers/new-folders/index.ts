import defineTrigger from '../../../../helpers/define-trigger';
import newFolders from './new-folders';

export default defineTrigger({
  name: 'New Folders',
  key: 'newFolders',
  pollInterval: 15,
  description:
    'Triggers when a new folder is added directly to a specific folder (but not its subfolder).',
  arguments: [
    {
      label: 'Folder',
      key: 'folderId',
      type: 'dropdown' as const,
      required: false,
      description:
        'Check a specific folder for new subfolders. Please note: new folders added to subfolders inside the folder you choose here will NOT trigger this flow. Defaults to the top-level folder if none is picked.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFolders',
          },
        ],
      },
    },
  ],

  async run($) {
    await newFolders($);
  },
});