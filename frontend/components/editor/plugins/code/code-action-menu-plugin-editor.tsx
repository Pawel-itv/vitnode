import { createPortal } from 'react-dom';

import { ContainerCodeActionMenuPluginEditor } from './container-code-action-menu-plugin-editor';

interface Props {
  anchorElem?: HTMLElement;
}

export const CodeActionMenuPluginEditor = ({ anchorElem = document.body }: Props) => {
  return createPortal(<ContainerCodeActionMenuPluginEditor anchorElem={anchorElem} />, anchorElem);
};
