'use client';

import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { File } from 'lucide-react';
import Image from 'next/image';

import { acceptMimeTypeImage, FilesHandlerAttributes } from './files';
import { formatBytes } from '@/helpers/format-bytes';

import { CONFIG } from '../../../helpers/config-with-env';

const FileFromNextWithNode = ({
  node: { attrs: data },
}: {
  node: { attrs: FilesHandlerAttributes };
}) => {
  if (
    acceptMimeTypeImage.includes(data.mimetype) &&
    data.width &&
    data.height
  ) {
    return (
      <NodeViewWrapper className="inline-block">
        <div data-drag-handle="" draggable>
          <Image
            src={`${CONFIG.graphql_public_url}/${data.dir_folder}/${data.file_name}`}
            alt={data.file_alt ?? data.file_name_original}
            sizes="100vw"
            className="h-auto w-full"
            width={data.width}
            height={data.height}
          />
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="inline-block" data-drag-handle="" draggable>
      <button
        className="cursor-gap bg-muted hover:bg-accent rounded-md text-left text-sm font-medium transition-colors"
        type="button"
        tabIndex={-1}
      >
        <div className="flex items-center gap-5 px-5 py-2">
          <File className="text-muted-foreground size-7" />
          <div className="pointer-events-none select-none">
            <span className="block max-w-80 truncate leading-tight">
              {data.file_name_original}
            </span>
            <div className="text-muted-foreground space-x-2 text-sm">
              <span>{formatBytes(data?.file_size ?? 0)}</span>
              <span>&middot;</span>
              <span>{data.mimetype}</span>
            </div>
          </div>
        </div>
      </button>
    </NodeViewWrapper>
  );
};

export const renderReactNode = () =>
  ReactNodeViewRenderer(FileFromNextWithNode);
