"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { useWrapperCategoryForum } from "@/plugins/forum/hooks/forum/use-wrapper-category-forum";

interface Props {
  children: React.ReactNode;
}

export const ChildrenWrapperCategoryForum = ({ children }: Props) => {
  const { open } = useWrapperCategoryForum();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          className="overflow-hidden"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 }
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
